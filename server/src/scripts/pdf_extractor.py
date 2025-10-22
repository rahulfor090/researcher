#!/usr/bin/env python3
"""
pdf_extractor.py - PDF Image and Table Extractor

Extracts images and tables from PDF files, saving them to src/uploads/images directory.
Tables are captured as images directly from the PDF.
CSV files are deleted after extraction.

Author: Musashiii03
Last Updated: 2025-10-19 17:28:28 UTC

Requires:
    py -3 -m pip install PyMuPDF numpy Pillow camelot-py pandas opencv-python-headless
"""

import sys
import os
import json
from pathlib import Path
import traceback
from datetime import datetime

# Script metadata
__version__ = "1.3.0"
__author__ = "Musashiii03"
__updated__ = "2025-10-19 17:28:28 UTC"

# Check required imports
try:
    import fitz  # PyMuPDF
except ImportError:
    print("ERROR: PyMuPDF not installed. Run: py -3 -m pip install PyMuPDF", file=sys.stderr)
    sys.exit(1)

try:
    import numpy as np
except ImportError:
    print("ERROR: NumPy not installed. Run: py -3 -m pip install numpy", file=sys.stderr)
    sys.exit(1)

try:
    from PIL import Image
except ImportError:
    print("ERROR: Pillow not installed. Run: py -3 -m pip install Pillow", file=sys.stderr)
    sys.exit(1)

# Optional dependencies
try:
    import camelot
    CAMELOT_AVAILABLE = True
except ImportError:
    print("WARNING: Camelot not installed. Will use PyMuPDF only for table extraction.", file=sys.stderr)
    CAMELOT_AVAILABLE = False

try:
    import cv2
    OPENCV_AVAILABLE = True
except ImportError:
    OPENCV_AVAILABLE = False


def ensure_images_directory(base_dir):
    """
    Ensure the images subdirectory exists in src/uploads.
    
    Args:
        base_dir: Base directory (src/uploads)
    
    Returns:
        Path to images directory
    """
    images_dir = os.path.join(base_dir, 'images')
    if not os.path.exists(images_dir):
        os.makedirs(images_dir, exist_ok=True)
        print(f"DEBUG: Created images directory: {images_dir}", file=sys.stderr)
    else:
        print(f"DEBUG: Using existing images directory: {images_dir}", file=sys.stderr)
    return images_dir


def extract_images_from_pdf(pdf_path, output_dir):
    """
    Extract embedded images from PDF using PyMuPDF.
    
    Args:
        pdf_path: Path to the PDF file
        output_dir: Directory to save extracted images (src/uploads/images)
    
    Returns:
        List of extracted image filenames
    """
    extracted_images = []
    
    if not os.path.exists(pdf_path):
        print(f"ERROR: PDF file not found: {pdf_path}", file=sys.stderr)
        return extracted_images
    
    try:
        pdf_document = fitz.open(pdf_path)
        base_name = Path(pdf_path).stem
        total_pages = len(pdf_document)
        
        print(f"DEBUG: PDF has {total_pages} pages", file=sys.stderr)
        
        for page_num in range(total_pages):
            page = pdf_document[page_num]
            image_list = page.get_images(full=True)
            
            if image_list:
                print(f"DEBUG: Page {page_num + 1}/{total_pages}: Found {len(image_list)} images", file=sys.stderr)
            
            for img_index, img in enumerate(image_list):
                try:
                    xref = img[0]
                    base_image = pdf_document.extract_image(xref)
                    image_bytes = base_image["image"]
                    image_ext = base_image["ext"]
                    
                    # Create filename
                    image_filename = f"{base_name}-page{page_num + 1}-img{img_index + 1}.{image_ext}"
                    image_path = os.path.join(output_dir, image_filename)
                    
                    # Save image
                    with open(image_path, "wb") as image_file:
                        image_file.write(image_bytes)
                    
                    extracted_images.append(image_filename)
                    print(f"SUCCESS: Extracted image: {image_filename}", file=sys.stderr)
                    
                except Exception as img_error:
                    print(f"WARNING: Failed to extract image {img_index + 1} from page {page_num + 1}: {str(img_error)}", file=sys.stderr)
                    continue
        
        pdf_document.close()
        print(f"DEBUG: Total images extracted: {len(extracted_images)}", file=sys.stderr)
        return extracted_images
        
    except Exception as e:
        print(f"ERROR: Error extracting images: {str(e)}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        return extracted_images


def capture_table_as_image(page, table_bbox, output_path, zoom=2.0):
    """
    Capture a table region from PDF page as an image.
    
    Args:
        page: PyMuPDF page object
        table_bbox: Bounding box of the table (x0, y0, x1, y1) or fitz.Rect
        output_path: Path to save the image
        zoom: Zoom factor for higher quality (default 2.0)
    
    Returns:
        True if successful, False otherwise
    """
    try:
        # Handle different bbox types
        if hasattr(table_bbox, 'x0'):
            # Already a fitz.Rect
            rect = table_bbox
        elif isinstance(table_bbox, (list, tuple)) and len(table_bbox) == 4:
            # Tuple or list of coordinates
            rect = fitz.Rect(table_bbox)
        else:
            print(f"ERROR: Invalid bbox type: {type(table_bbox)}", file=sys.stderr)
            return False
        
        # Ensure rect is valid
        if rect.is_empty or rect.is_infinite:
            print(f"ERROR: Invalid table rectangle: {rect}", file=sys.stderr)
            return False
        
        # Add some padding around the table
        padding = 10
        rect.x0 = max(0, rect.x0 - padding)
        rect.y0 = max(0, rect.y0 - padding)
        rect.x1 = min(page.rect.width, rect.x1 + padding)
        rect.y1 = min(page.rect.height, rect.y1 + padding)
        
        # Create a matrix for higher resolution
        mat = fitz.Matrix(zoom, zoom)
        
        # Render the table area as an image
        pix = page.get_pixmap(matrix=mat, clip=rect)
        
        # Save the image
        pix.save(output_path)
        
        print(f"DEBUG: Captured table region {rect} to {output_path}", file=sys.stderr)
        return True
        
    except Exception as e:
        print(f"ERROR: Failed to capture table image: {str(e)}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        return False


def extract_tables_from_pdf(pdf_path, output_dir):
    """
    Extract tables from PDF by capturing them as images directly from the PDF.
    
    Args:
        pdf_path: Path to the PDF file
        output_dir: Directory to save extracted table images (src/uploads/images)
    
    Returns:
        List of extracted table image filenames
    """
    extracted_tables = []
    base_name = Path(pdf_path).stem
    
    # Always use PyMuPDF fallback (more reliable for image capture)
    print("DEBUG: Using PyMuPDF for table detection and capture...", file=sys.stderr)
    return extract_tables_fallback(pdf_path, output_dir)


def extract_tables_fallback(pdf_path, output_dir):
    """
    Extract tables using PyMuPDF and capture as images directly from PDF.
    CSV files are created temporarily but deleted after processing.
    
    Args:
        pdf_path: Path to the PDF file
        output_dir: Directory to save extracted table files (src/uploads/images)
    
    Returns:
        List of extracted table filenames
    """
    extracted_tables = []
    csv_files_to_delete = []
    base_name = Path(pdf_path).stem
    
    try:
        pdf_document = fitz.open(pdf_path)
        total_pages = len(pdf_document)
        
        for page_num in range(total_pages):
            page = pdf_document[page_num]
            
            try:
                # Find tables on the page
                tables = page.find_tables()
                
                if tables and hasattr(tables, 'tables') and tables.tables:
                    print(f"DEBUG: Page {page_num + 1}/{total_pages}: Found {len(tables.tables)} tables", file=sys.stderr)
                    
                    for table_index, table in enumerate(tables.tables):
                        try:
                            # Extract table data
                            table_data = table.extract()
                            
                            if not table_data or len(table_data) == 0:
                                print(f"WARNING: Table {table_index + 1} on page {page_num + 1} is empty", file=sys.stderr)
                                continue
                            
                            # Save as CSV temporarily (for debugging purposes)
                            csv_filename = f"{base_name}-page{page_num + 1}-table{table_index + 1}.csv"
                            csv_path = os.path.join(output_dir, csv_filename)
                            
                            with open(csv_path, 'w', encoding='utf-8') as f:
                                for row in table_data:
                                    # Escape quotes in cells
                                    escaped_row = [f'"{str(cell).replace(chr(34), chr(34)+chr(34))}"' if cell else '""' for cell in row]
                                    f.write(','.join(escaped_row) + '\n')
                            
                            print(f"DEBUG: Created temporary CSV: {csv_filename}", file=sys.stderr)
                            csv_files_to_delete.append(csv_path)
                            
                            # Capture table region as image from PDF
                            img_filename = f"{base_name}-page{page_num + 1}-table{table_index + 1}.png"
                            img_path = os.path.join(output_dir, img_filename)
                            
                            # Get table bounding box
                            if hasattr(table, 'bbox'):
                                bbox = table.bbox
                                
                                # Capture table as image
                                success = capture_table_as_image(page, bbox, img_path)
                                
                                if success:
                                    extracted_tables.append(img_filename)
                                    print(f"SUCCESS: Captured table image: {img_filename}", file=sys.stderr)
                                else:
                                    print(f"WARNING: Failed to capture table {table_index + 1} as image", file=sys.stderr)
                            else:
                                print(f"WARNING: No bbox for table {table_index + 1}", file=sys.stderr)
                                
                        except Exception as table_error:
                            print(f"WARNING: Error processing table {table_index + 1} on page {page_num + 1}: {str(table_error)}", file=sys.stderr)
                            continue
                            
            except Exception as page_error:
                print(f"WARNING: Error processing tables on page {page_num + 1}: {str(page_error)}", file=sys.stderr)
                continue
        
        pdf_document.close()
        
        # Delete all CSV files
        if csv_files_to_delete:
            print(f"\nDEBUG: Cleaning up {len(csv_files_to_delete)} CSV files...", file=sys.stderr)
            for csv_path in csv_files_to_delete:
                try:
                    if os.path.exists(csv_path):
                        os.remove(csv_path)
                        print(f"DEBUG: Deleted CSV: {os.path.basename(csv_path)}", file=sys.stderr)
                except Exception as del_error:
                    print(f"WARNING: Failed to delete {csv_path}: {str(del_error)}", file=sys.stderr)
        
        print(f"DEBUG: Total tables extracted: {len(extracted_tables)}", file=sys.stderr)
        return extracted_tables
        
    except Exception as e:
        print(f"ERROR: Error in table extraction: {str(e)}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        
        # Cleanup CSV files even on error
        for csv_path in csv_files_to_delete:
            try:
                if os.path.exists(csv_path):
                    os.remove(csv_path)
            except:
                pass
        
        return extracted_tables


def main():
    """Main entry point for the PDF extractor."""
    
    if len(sys.argv) < 2:
        print("Usage: py -3 pdf_extractor.py <pdf_path>", file=sys.stderr)
        print("Example: py -3 pdf_extractor.py document.pdf", file=sys.stderr)
        sys.exit(2)
    
    pdf_path = sys.argv[1]
    
    if not os.path.exists(pdf_path):
        print(f"ERROR: PDF file not found: {pdf_path}", file=sys.stderr)
        sys.exit(2)
    
    # Base directory is src/uploads
    base_dir = os.path.dirname(os.path.abspath(pdf_path))
    
    # Create/ensure images subdirectory exists
    output_dir = ensure_images_directory(base_dir)
    
    print("=" * 60, file=sys.stderr)
    print("PDF EXTRACTOR - Starting Extraction", file=sys.stderr)
    print(f"Version: {__version__} | Author: {__author__}", file=sys.stderr)
    print(f"Updated: {__updated__}", file=sys.stderr)
    print("=" * 60, file=sys.stderr)
    print(f"DEBUG: Input PDF: {pdf_path}", file=sys.stderr)
    print(f"DEBUG: Base directory: {base_dir}", file=sys.stderr)
    print(f"DEBUG: Output directory: {output_dir}", file=sys.stderr)
    print(f"DEBUG: Camelot available: {CAMELOT_AVAILABLE}", file=sys.stderr)
    print(f"DEBUG: OpenCV available: {OPENCV_AVAILABLE}", file=sys.stderr)
    print("=" * 60, file=sys.stderr)
    
    # Extract images
    print("\nDEBUG: Starting image extraction...", file=sys.stderr)
    extracted_images = extract_images_from_pdf(pdf_path, output_dir)
    
    # Extract tables (as images captured from PDF)
    print("\nDEBUG: Starting table extraction...", file=sys.stderr)
    extracted_tables = extract_tables_from_pdf(pdf_path, output_dir)
    
    # Build result object
    result = {
        "success": True,
        "pdf_path": pdf_path,
        "output_dir": output_dir,
        "images": extracted_images,
        "tables": extracted_tables,
        "total_images": len(extracted_images),
        "total_tables": len(extracted_tables),
        "extractor_version": __version__,
        "extraction_timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    }
    
    print("\n" + "=" * 60, file=sys.stderr)
    print("EXTRACTION SUMMARY", file=sys.stderr)
    print("=" * 60, file=sys.stderr)
    print(f"DEBUG: Total images: {len(extracted_images)}", file=sys.stderr)
    print(f"DEBUG: Total tables: {len(extracted_tables)}", file=sys.stderr)
    print(f"DEBUG: Files saved to: {output_dir}", file=sys.stderr)
    print("=" * 60, file=sys.stderr)
    
    # Output JSON result to stdout (for Node.js parsing)
    print(json.dumps(result, indent=2))
    
    if extracted_images or extracted_tables:
        print("\nSUCCESS: Extraction completed successfully!", file=sys.stderr)
        print("SUCCESS: All CSV files have been deleted.", file=sys.stderr)
        sys.exit(0)
    else:
        print("\nWARNING: No images or tables found in the PDF", file=sys.stderr)
        sys.exit(0)


if __name__ == "__main__":
    main()
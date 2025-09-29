import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
	const location = useLocation();

	useEffect(() => {
		try {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		} catch (_) {
			window.scrollTo(0, 0);
		}
		// Also reset any scroll containers if needed in future
	}, [location.pathname, location.hash, location.search]);

	return null;
}



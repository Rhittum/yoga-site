const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
	navToggle.addEventListener("click", () => {
		const isOpen = siteNav.classList.toggle("is-open");
		navToggle.setAttribute("aria-expanded", String(isOpen));
	});
}

const page = document.body.dataset.page;
document.querySelectorAll(".site-nav a").forEach((link) => {
	const href = link.getAttribute("href");
	if (
		(page === "home" && href === "index.html") ||
		(page === "about" && href === "about.html") ||
		(page === "classes" && href === "classes.html") ||
		(page === "contact" && href === "contact.html") ||
		(page === "reviews" && href === "reviews.html")
	) {
		link.classList.add("is-active");
	}
});

const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("is-visible");
			} else if (entry.boundingClientRect.top > 0) {
				entry.target.classList.remove("is-visible");
			}
		});
	},
	{
		threshold: 0.18,
		rootMargin: "0px 0px -10% 0px",
	}
);

revealItems.forEach((item) => revealObserver.observe(item));

document.querySelectorAll(".dynamic-text").forEach((element) => {
	const values = JSON.parse(element.dataset.rotate || "[]");

	if (values.length < 2) {
		return;
	}

	let index = 0;

	window.setInterval(() => {
		element.style.opacity = "0";
		element.style.transform = "translateY(10px)";

		window.setTimeout(() => {
			index = (index + 1) % values.length;
			element.textContent = values[index];
			element.style.opacity = "1";
			element.style.transform = "translateY(0)";
		}, 600);
	}, 4200);
});

const contactForm = document.querySelector(".contact-form");
const WHATSAPP_NUMBER = "917988299200";

function showToast(message) {
	const overlay = document.createElement("div");
	overlay.className = "toast-overlay";
	overlay.innerHTML = `<span>${message}</span>`;
	document.body.appendChild(overlay);
	requestAnimationFrame(() => overlay.classList.add("is-visible"));

	setTimeout(() => overlay.classList.remove("is-visible"), 1800);
	setTimeout(() => overlay.remove(), 3000);
}

if (contactForm) {
	const nameInput = contactForm.querySelector('input[name="name"]');
	const messageInput = contactForm.querySelector("textarea");

	nameInput.addEventListener("input", () => nameInput.classList.remove("is-error"));
	messageInput.addEventListener("input", () => messageInput.classList.remove("is-error"));

	contactForm.addEventListener("submit", (event) => {
		event.preventDefault();

		const name = nameInput.value.trim();
		const message = messageInput.value.trim();
		let hasError = false;

		if (!name) {
			nameInput.classList.add("is-error");
			hasError = true;
		}
		if (!message) {
			messageInput.classList.add("is-error");
			hasError = true;
		}

		if (hasError) {
			showToast("Please fill in all fields");
			return;
		}

		const text = encodeURIComponent(
			`*New Inquiry*\n\n${name}\n\nInquiry: ${message}`
		);

		window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");

		const button = contactForm.querySelector("button");
		if (button) {
			button.disabled = true;
		}

		showToast("Inquiry Sent");
	});
}

const reviewsContainer = document.querySelector('.review-grid');

function renderStars(rating) {
	let html = '<div class="review-stars">';
	for (let i = 1; i <= 5; i++) {
		html += `<span class="star${i <= rating ? ' is-filled' : ''}"></span>`;
	}
	html += '</div>';
	return html;
}

if (page === 'home') {
	const scrollTrack = document.getElementById('scroll-track');

	fetch('http://127.0.0.1:3000/api/reviews/rating')
		.then(r => r.json())
		.then(data => {
			const starsEl = document.getElementById('average-stars');
			const scoreEl = document.getElementById('average-score');
			const countEl = document.getElementById('review-count');
			if (data.average) {
				scoreEl.textContent = data.average;
				countEl.textContent = `${data.count} reviews`;
				starsEl.innerHTML = renderStars(Math.round(data.average));
			} else {
				scoreEl.textContent = '—';
				countEl.textContent = 'No reviews yet';
			}
		})
		.catch(() => {});

	if (scrollTrack) {
		fetch('http://127.0.0.1:3000/api/reviews')
			.then(r => r.json())
			.then(reviews => {
				if (reviews.length === 0) {
					scrollTrack.innerHTML = '<div class="scroll-item">No reviews yet</div>';
					return;
				}
				const items = reviews.map(item => `
					<div class="scroll-item">
						${item.rating ? renderStars(item.rating) : ''}
						<strong>${item.name}</strong>
						<p>${item.review}</p>
					</div>
				`).join('');
				scrollTrack.innerHTML = items + items;
			})
			.catch(() => {});
	}
}

fetch('http://127.0.0.1:3000/api/reviews')
	.then(response => response.json())
	.then(reviews => {
		reviews.forEach(item => {
			const reviewDiv = document.createElement('div');
			reviewDiv.className = 'review-card';
			reviewDiv.innerHTML = `
			${item.rating ? renderStars(item.rating) : ''}
			<h3>${item.name}</h3>
			<p>${item.review}</p>
			`;
			reviewsContainer.appendChild(reviewDiv);
		});
	})
	.catch(error => console.error('Error fetching reviews', error));

const addBtn = document.querySelector('.review-add-btn');
const modalOverlay = document.querySelector('.review-modal-overlay');
const modalClose = document.querySelector('.review-modal-close');
const reviewForm = document.querySelector('.review-form');

if (addBtn && modalOverlay) {
	addBtn.addEventListener('click', () => {
		modalOverlay.classList.add('is-visible');
	});

	function closeReviewModal() {
		modalOverlay.classList.remove('is-visible');
	}

	modalClose.addEventListener('click', closeReviewModal);
	modalOverlay.addEventListener('click', (e) => {
		if (e.target === modalOverlay) closeReviewModal();
	});
}

const starRating = document.querySelector('.star-rating');
let selectedRating = 0;

if (starRating) {
	function highlightStars(count) {
		starRating.querySelectorAll('.star').forEach(star => {
			const value = parseInt(star.dataset.value);
			star.classList.toggle('is-hover', value <= count);
		});
	}

	function setSelected(count) {
		starRating.querySelectorAll('.star').forEach(star => {
			const value = parseInt(star.dataset.value);
			star.classList.toggle('is-selected', value <= count);
		});
	}

	starRating.querySelectorAll('.star').forEach(star => {
		star.addEventListener('mouseenter', () => highlightStars(parseInt(star.dataset.value)));
		star.addEventListener('click', () => {
			selectedRating = parseInt(star.dataset.value);
			setSelected(selectedRating);
		});
	});

	starRating.addEventListener('mouseleave', () => highlightStars(selectedRating));
}

if (reviewForm) {
	reviewForm.addEventListener('submit', (e) => {
		e.preventDefault();

		const name = reviewForm.querySelector('input[name="name"]').value.trim();
		const phone = reviewForm.querySelector('input[name="phone"]').value.trim();
		const review = reviewForm.querySelector('textarea').value.trim();

		if (!name || !review) {
			showToast('Please fill in all required fields');
			return;
		}

		if (selectedRating === 0) {
			showToast('Please select a rating');
			return;
		}

		const button = reviewForm.querySelector('button[type="submit"]');
		button.disabled = true;

		fetch('http://127.0.0.1:3000/api/reviews', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, phone, review, rating: selectedRating })
		})
			.then(response => {
				if (!response.ok) throw new Error('Failed to submit');
				return response.json();
			})
			.then(() => {
				const card = document.createElement('div');
				card.className = 'review-card';
				card.innerHTML = `
				${renderStars(selectedRating)}
				<h3>${name}</h3>
				<p>${review}</p>
				`;
				reviewsContainer.prepend(card);
				reviewForm.reset();
				selectedRating = 0;
				setSelected(0);
				closeReviewModal();
				showToast('Review submitted!');
			})
			.catch(error => {
				console.error('Error submitting review', error);
				showToast('Could not submit review');
			})
			.finally(() => {
				button.disabled = false;
			});
	});
}

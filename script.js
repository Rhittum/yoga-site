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
		(page === "contact" && href === "contact.html")
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

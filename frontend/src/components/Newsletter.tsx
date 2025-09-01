import React, { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Call your API here, e.g., API.post('/newsletter', { email });

    setIsModalOpen(true); // show thank you modal
    setEmail(""); // reset input
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="py-16 bg-bg-light dark:bg-bg-dark flex flex-col items-center px-4">
      <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-bg-dark dark:text-bg-light text-center">
        Subscribe to Our Newsletter
      </h2>
      <p className="text-text-secondary dark:text-text-secondary mb-8 text-center max-w-md text-sm sm:text-base">
        Get the latest updates, offers, and news delivered directly to your inbox.
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md"
      >
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 px-4 py-2 rounded-md border border-secondary dark:border-secondary-dark focus:outline-none focus:ring-2 focus:ring-highlight dark:bg-bg-dark dark:text-text-primary"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-primary dark:bg-accent text-text-primary dark:text-text-primary rounded-md hover:bg-highlight dark:hover:bg-highlight transition w-full sm:w-auto"
        >
          Subscribe
        </button>
      </form>

      {/* Thank You Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-bg-light dark:bg-bg-dark rounded-lg p-8 max-w-sm text-center shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-text-primary dark:text-text-primary">
              Thank You!
            </h3>
            <p className="text-text-secondary dark:text-text-secondary mb-6 text-sm sm:text-base">
              Your subscription has been received.
            </p>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-primary dark:bg-accent text-text-primary dark:text-text-primary rounded-md hover:bg-highlight dark:hover:bg-highlight transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

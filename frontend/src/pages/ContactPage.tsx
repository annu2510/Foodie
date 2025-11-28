const ContactUs = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-6 md:px-20">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        

        {/* Contact Information and Form */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Left side - Contact Info */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">📍 Our Address</h2>
            <p className="text-lg leading-relaxed">
              Foodie HQ<br />
              K.R. Mangalam University, Sohna Road<br />
              Gurugram, Haryana - 122103
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">📞 Phone</h2>
            <p className="text-lg leading-relaxed">+91 8435659829</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">📧 Email</h2>
            <p className="text-lg leading-relaxed">support@foodie.com</p>
          </div>

          {/* Right side - Contact Form */}
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-lg font-medium mb-2">Name</label>
              <input type="text" id="name" name="name" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" required />
            </div>

            <div>
              <label htmlFor="email" className="block text-lg font-medium mb-2">Email</label>
              <input type="email" id="email" name="email" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" required />
            </div>

            <div>
              <label htmlFor="message" className="block text-lg font-medium mb-2">Message</label>
              <textarea id="message" name="message" rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" required></textarea>
            </div>

            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-semibold py-3 rounded-2xl transition-all">
              Send Message
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ContactUs;

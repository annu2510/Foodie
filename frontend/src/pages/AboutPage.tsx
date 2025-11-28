const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-6 md:px-20">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
      

        {/* Welcome Section */}
        <section className="mb-12 text-center">
          <h2 className="text-2xl font-semibold mb-4"> Welcome to Foodie!</h2>
          <p className="text-lg leading-relaxed">
            At Foodie, we're on a mission to make food ordering for college students and faculty members faster, easier, and way more delicious. No more long lines or waiting — just fresh food, one tap away!
          </p>
        </section>

        {/* Our Mission */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">🚀 Our Mission</h2>
          <p className="text-lg leading-relaxed">
            To deliver freshly-prepared, affordable meals to every corner of the campus, saving you time and satisfying your cravings with just a few clicks.
          </p>
        </section>

        {/* Our Story */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">📖 Our Story</h2>
          <p className="text-lg leading-relaxed">
            Foodie was born out of a simple idea — <em>"What if grabbing a quick bite between classes could be faster and more fun?"</em> Started by a group of food-loving students, our platform connects you with your favorite campus cafeterias and restaurants, making food ordering seamless and exciting.
          </p>
        </section>

        {/* Why Choose Us */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">🌟 Why Choose Foodie?</h2>
          <ul className="list-disc list-inside text-lg space-y-2">
            <li>🍕 Fresh and Tasty Meals Always</li>
            <li>🚚 Quick Pickups and Deliveries</li>
            <li>📱 Easy Ordering via Website</li>
            <li>💬 Real-Time Order Updates</li>
            <li>🎁 Exclusive Campus Deals and Discounts</li>
          </ul>
        </section>

        {/* Meet the Team */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">👨‍💻 Meet Our Team</h2>
          <p className="text-lg leading-relaxed">
            A passionate group of students, tech enthusiasts, and food lovers — working together to transform your campus dining experience!
          </p>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4">📢 Join the Movement!</h2>
          <p className="text-lg leading-relaxed mb-6">
            Skip the lines, skip the hassle — order smarter with Foodie today.
          </p>
          <a href="/menu" className="inline-block bg-green-600 hover:bg-green-700 text-white text-lg font-semibold py-3 px-6 rounded-2xl transition-all">
            👉 Browse Menu
          </a>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;

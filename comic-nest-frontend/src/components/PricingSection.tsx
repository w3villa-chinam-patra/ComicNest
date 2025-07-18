const PricingSection = () => {
  const plans = [
    {
      name: "Free",
      color: "#15353561",
      price: 0,
      features: [
        "Access to free comics",
        "Limited weekly reads",
        "Community access",
      ],
    },
    {
      name: "Silver",
      price: 299,
      color: "#46474973",
      features: [
        "Access to exclusive comics",
        "Downloadable artwork and posters",
        "Ad-free reading experience",
        "Support for multiple devices",
      ],
    },
    {
      name: "Gold",
      price: 599,
      color: "#5535008c",
      features: [
        "All Silver features",
        "Rare & extended edition comics",
        "Early access to new releases",
        "Exclusive creator interviews",
        "Priority customer support",
      ],
    },
  ];

  return (
    <section className="py-14">
      <div className="max-w-screen-xl mx-auto px-4 text-gray-300 md:px-8">
        <div className="relative max-w-xl mx-auto sm:text-center">
          <h3 className="text-gray-200 text-3xl font-semibold sm:text-4xl">
            Choose Your Adventure
          </h3>
          <div className="mt-3 max-w-xl text-gray-400">
            <p>
              Whether you're a casual reader or a die-hard fan, ComicNest has a
              plan that fits your journey. Unlock exclusive comics, rare
              editions, and immersive experiences tailored just for you.
            </p>
          </div>
        </div>
        <div className="mt-16 space-y-6 justify-center gap-6 sm:grid sm:grid-cols-2 sm:space-y-0 lg:grid-cols-3">
          {plans.map((item, idx) => (
            <div
              style={{ backgroundColor: item.color }}
              key={idx}
              className="relative flex-1 flex items-stretch flex-col p-8 rounded-xl border border-neutral-600 drop-shadow-xl drop-shadow-neutral-800"
            >
              <div>
                <span className="text-gray-300 font-medium">{item.name}</span>
                <div className="mt-4 text-gray-200 text-3xl font-semibold">
                  ₹{item.price}{" "}
                  <span className="text-xl text-gray-400 font-normal">/mo</span>
                </div>
              </div>
              <ul className="py-8 space-y-3">
                {item.features.map((featureItem, idx) => (
                  <li key={idx} className="flex items-center gap-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-amber-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    {featureItem}
                  </li>
                ))}
              </ul>
              <div className="flex-1 flex items-end">
                <button className="px-3 py-3 rounded-lg w-full font-semibold text-sm duration-150 text-white cursor-pointer bg-amber-600 hover:bg-amber-500 active:bg-amber-700">
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

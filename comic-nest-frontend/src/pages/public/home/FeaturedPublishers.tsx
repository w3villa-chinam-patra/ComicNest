const FeaturedPublishers = () => {
  const featuredPublishers = [
    {
      imageUrl: "/images/featured-publishers/darkHorse.png",
      name: "Dark Horse Comics",
    },
    {
      imageUrl: "/images/featured-publishers/dc.png",
      name: "DC Comics",
    },
    {
      imageUrl: "/images/featured-publishers/marvel.png",
      name: "Marvel Comics",
    },
    {
      imageUrl: "/images/featured-publishers/boom.png",
      name: "BOOM! Studios",
    },
    {
      imageUrl: "/images/featured-publishers/image.png",
      name: "Image Comics",
    },
  ];
  return (
    <div className="flex flex-col gap-12 items-center">
      <h3 className="my-4 text-gray-200 text-3xl font-semibold sm:text-4xl">
        Featured Publishers
      </h3>
      <div className="featured-publishers flex gap-18 px-8 flex-wrap justify-center">
        {featuredPublishers.map((publisherDetails, index) => (
          <div key={index} className="flex flex-col gap-2 items-center">
            <img
              className="rounded-2xl overflow-hidden w-28"
              src={publisherDetails.imageUrl}
              alt={`${publisherDetails.name} logo`}
            />
            <div className="text-center">{publisherDetails.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default FeaturedPublishers;

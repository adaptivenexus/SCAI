const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="space-y-4 bg-secondary-gradient p-6 rounded-br-[60px] rounded-tl-[60px] flex-1">
      <div className="p-3 bg-primary-gradient w-max rounded-lg text-background">
        {icon}
      </div>
      <h5 className="heading-5">{title}</h5>
      <p className="body-text text-secondary-foreground">{description}</p>
    </div>
  );
};
export default FeatureCard;

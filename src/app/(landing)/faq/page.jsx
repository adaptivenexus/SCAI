import FAQQue from "@/components/LandingPageComponents/FAQQue";

const FAQPage = () => {
  const questionAnswers = [
    {
      question: "What are the benefits of using our AI solutions?",
      answer:
        "Our AI solutions offer enhanced efficiency, cost savings, improved decision-making, and competitive advantage by leveraging data-driven insights and automation.",
    },
    {
      question: "How long does it take to implement an AI solution?",
      answer:
        "The implementation time varies depending on the complexity of the project. Typically, it can take anywhere from a few weeks to several months.",
    },
    {
      question:
        "Do you provide ongoing support after implementing AI solutions?",
      answer:
        "Yes, we offer continuous support and maintenance to ensure your AI solutions remain up-to-date and perform optimally.",
    },
    {
      question: "Can your AI solutions be integrated with existing systems?",
      answer:
        "Absolutely, our AI solutions are designed to seamlessly integrate with your current systems, ensuring minimal disruption and maximum compatibility.",
    },
    {
      question: "How do you ensure the security and privacy of my data?",
      answer:
        "We adhere to strict data security protocols and use advanced encryption technologies to ensure the confidentiality and integrity of your data.",
    },
  ];
  return (
    <div>
      <div className="wrapper space-y-10 py-24">
        <div className="text-center space-y-3">
          <p className="heading-top text-primary">FAQ</p>
          <h3 className="heading-3 text-foreground">
            Frequently Asked Questions
          </h3>
          <p className="subtitle-text-2 text-secondary-foreground">
            Find answers to common questions about our services, solutions, and
            how we can help your business thrive
          </p>
        </div>
        <div className="px-11 py-5 rounded-[32px]">
          {questionAnswers.map((que, index) => (
            <div key={index}>
              <FAQQue question={que.question} answer={que.answer} />
              {index == questionAnswers.length - 1 ? null : (
                <div className="h-[1px] bg-[#535463] w-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default FAQPage;

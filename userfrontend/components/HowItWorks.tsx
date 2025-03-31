import { CheckCircle, UploadIcon, Users, Zap } from "lucide-react"

export const HowItWorks = () => {
  const steps = [
    {
      icon: <UploadIcon className="h-10 w-10 text-primary" />,
      title: "Upload Your Data",
      description: "Upload images or other data that needs labeling through our simple interface.",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Community Labeling",
      description: "Our network of freelancers will label your data with high accuracy and speed.",
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-primary" />,
      title: "Quality Verification",
      description: "Multiple labelers work on each task to ensure high-quality results.",
    },
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Receive Results",
      description: "Get your labeled data back quickly, ready to use in your AI models or applications.",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold gradient-text inline-block mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            FreelanceChain makes data labeling simple, efficient, and reliable through our blockchain-powered platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 shadow-md card-hover animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-center mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold text-center mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-center">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


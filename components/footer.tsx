export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-surface border-t border-border py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-primary mb-4 font-inter">Legal Eagle</h3>
            <p className="text-text-secondary font-lora mb-4 max-w-md">
              AI-powered GST compliance platform designed specifically for Indian MSMEs. Simplify your tax compliance
              with intelligent automation.
            </p>
            <div className="flex gap-4">
              <span className="text-sm text-text-secondary">Trusted by 1000+ businesses</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-primary mb-4 font-inter">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="text-text-secondary hover:text-primary transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-text-secondary hover:text-primary transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#security" className="text-text-secondary hover:text-primary transition-colors">
                  Security
                </a>
              </li>
              <li>
                <a href="#blog" className="text-text-secondary hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-primary mb-4 font-inter">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:support@legaleagle.in"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Contact Support
                </a>
              </li>
              <li>
                <a href="#" className="text-text-secondary hover:text-primary transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-text-secondary hover:text-primary transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-text-secondary hover:text-primary transition-colors">
                  Status Page
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-text-secondary font-lora">© {currentYear} Legal Eagle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

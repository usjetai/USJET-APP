import { Link } from "wouter";

export function Footer() {
  return (
    <footer id="contact" className="border-t border-white/10 bg-black/60 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="text-2xl font-heading font-bold tracking-tighter text-white uppercase inline-block mb-4">
            USJET<span className="text-primary">.ai</span>
          </Link>
          <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
            Elite artificial intelligence infrastructure for aviation, aerospace, and advanced mobility.
            Engineered for zero-tolerance environments.
          </p>
          <div className="mt-6 flex gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all cursor-pointer">
              <span className="text-xs text-muted-foreground">X</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all cursor-pointer">
              <span className="text-xs text-muted-foreground">in</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all cursor-pointer">
              <span className="text-xs text-muted-foreground">gh</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h4>
          <ul className="space-y-2.5">
            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Operations</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Defense</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Space Systems</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Research API</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
          <ul className="space-y-2.5">
            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Careers</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Security</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} USJET.ai Corporation. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

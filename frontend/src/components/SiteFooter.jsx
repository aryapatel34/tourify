const SiteFooter = () => {
  return (
    <footer className="border-t border-outline-variant/20 bg-white/70 backdrop-blur-sm mt-xl">
      <div className="max-w-max-width-desktop mx-auto px-md lg:px-xl py-md flex flex-col gap-md lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-sm">
          <span className="font-headline-lg text-headline-lg font-bold text-on-surface">Tourify</span>
          <span className="text-on-surface-variant text-body-md">© 2024 Tourify AI Travel Companion. All rights reserved.</span>
        </div>

        <div className="flex flex-wrap items-center gap-md text-label-sm text-on-surface-variant">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Help Center</a>
          <a href="#" className="hover:text-primary transition-colors">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;

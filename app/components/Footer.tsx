export default function Footer() {
  return (
    <footer className="bg-black border-t border-accent-gray/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center text-sm text-accent-gray">
          <p>© {new Date().getFullYear()} WraithWatchers. Tracking the unseen.</p>
        </div>
      </div>
    </footer>
  );
}


import Link from 'next/link';
import Image from 'next/image';

export default function ThankYou() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Ghost Icon/Image */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-64 h-64 bg-gradient-to-br from-accent-orange/20 to-transparent rounded-full flex items-center justify-center">
            <div className="text-8xl animate-pulse">👻</div>
          </div>
        </div>

        {/* Thank You Message */}
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Thank <span className="text-accent-orange">You!</span>
        </h1>
        <p className="text-xl text-foreground mb-2">
          May you be clear of scary spirits!
        </p>
        <p className="text-accent-gray mb-8 max-w-lg mx-auto">
          Your sighting has been recorded. Thank you for helping our community stay vigilant against the supernatural. 
          Together, we track the unseen.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-4 bg-accent-orange text-black rounded-lg font-bold hover:bg-accent-orange/80 transition-colors"
          >
            View Sightings Map
          </Link>
          <Link
            href="/post"
            className="px-8 py-4 bg-black border border-accent-gray/30 text-foreground rounded-lg font-bold hover:bg-accent-gray/20 transition-colors"
          >
            Report Another Sighting
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 p-6 bg-black/50 border border-accent-gray/30 rounded-lg">
          <h2 className="text-lg font-bold mb-2 text-accent-orange">What Happens Next?</h2>
          <p className="text-sm text-accent-gray">
            Your sighting will be reviewed by our team and added to the public map. 
            In the future, you&apos;ll receive email updates about nearby paranormal activity.
          </p>
        </div>
      </div>
    </div>
  );
}


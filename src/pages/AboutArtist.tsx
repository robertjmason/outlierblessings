import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import artistImage from "@/assets/about-tk-the-artist.jpg";

const AboutArtist = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <section className="container mx-auto px-6 pt-8 pb-10">
          <div className="max-w-4xl mx-auto">
            <img
              src={artistImage}
              alt="The artist behind Outlier Blessings"
              className="w-full h-auto rounded-sm shadow-lg"
            />
          </div>
        </section>

        <section className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h1 className="heading-display text-foreground">About the Artist</h1>
              <p className="font-serif text-2xl italic text-muted-foreground">
                Broken But Not Shattered
              </p>
            </div>

            <div className="space-y-6">
              <p className="text-body text-lg leading-relaxed">
                When life shattered me, I discovered something unexpected in the broken pieces. Seven
                cryptogenic strokes (the doctors didn't know what was causing them), cervical
                dystonia, dysautonomia, and an unknown autoimmune disease stripped away everything I
                thought defined me. I lost my words, my mobility, my sense of purpose. I grieved the
                person I was.
              </p>

              <p className="text-body text-lg leading-relaxed">
                But in that breaking, something unexpected happened.
              </p>

              <p className="text-body text-lg leading-relaxed">
                As I've been healing, I started seeing those broken pieces differently. I've accepted
                this is my journey, but now it's lined with gold. There's a Japanese art called
                kintsugi where broken pottery is repaired with gold, turning the cracks into the most
                beautiful part. The philosophy behind it, wabi-sabi, finds beauty in imperfection and
                impermanence. It honors what broke and celebrates what remains.
              </p>

              <p className="text-body text-lg leading-relaxed">
                That's when I understood: I wasn't meant to go back to who I was. I was meant to
                become who I was always meant to be.
              </p>

              <p className="text-body text-lg leading-relaxed">
                Through my coaching and speaking work at Outlier Healing, I walk alongside other
                shattered people and help them find their new purpose. But I needed a creative outlet
                too, something with my hands that let me heal while giving back. That's where Outlier
                Blessings was born.
              </p>

              <p className="text-body text-lg leading-relaxed">
                Each mosaic cross I create is an act of transformation. As I work with shattered
                glass, arranging it with intention, I pray over every single cross. I pray for the
                person who will hold it, for healing, for hope, for resilience and strength.
              </p>

              <p className="text-body text-lg leading-relaxed">
                Every cross carries more than artistry. 10% of every purchase is donated to causes
                that touch my heart, helping me contribute back to my family and to God in ways I
                never imagined I could. It would be my honor to create a cross for you.
              </p>

              <p className="font-serif text-2xl italic text-foreground text-center pt-4">
                Because when we're hard pressed, that's when diamonds are made.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutArtist;

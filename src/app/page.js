import LandingPage from "./landing/page"

export default function Page() {
  return <LandingPage />
}

        {/* Free Section }
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Learning Without Boundaries</h2>
              <p className="text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
                NextSpelling is <strong>completely free</strong>. We believe that mastering a language should be accessible to everyone, everywhere.
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" variant="secondary" className="rounded-full" onClick={handleSignUp}>
                  Join the Community
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Coming Soon Section }
        <section className="py-20 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">The Future of NextSpelling</h2>
              <p className="text-muted-foreground mb-12">We are constantly evolving to provide better learning experiences.</p>
              
              <div className="grid sm:grid-cols-2 gap-6 text-left">
                <div className="flex gap-4 p-6 bg-muted rounded-xl">
                  <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">Advanced Parental Monitoring</h3>
                    <p className="text-sm text-muted-foreground">Track progress, identify struggle areas, and celebrate achievements with detailed reports.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-6 bg-muted rounded-xl">
                  <Globe className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">AI Suggestions & Explanations</h3>
                    <p className="text-sm text-muted-foreground">Get personalized explanations of why certain words are spelled the way they are.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-6 bg-muted rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">Custom Word Lists</h3>
                    <p className="text-sm text-muted-foreground">Focus on the words that matter most to you or your child's curriculum.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-6 bg-muted rounded-xl">
                  <Sparkles className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">Gamified Challenges</h3>
                    <p className="text-sm text-muted-foreground">Earn badges and climb the leaderboard as you master new spelling levels.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} NextSpelling. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
  */
}

import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="glass-navbar sticky top-0 z-50">
        <div className="container px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-smooth">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <section className="container px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-3 rounded-2xl bg-primary/10 text-primary mb-6">
              <FileText className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <Card className="p-8 md:p-12 glass-card space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using HabitLink, you agree to be bound by these Terms of Service and all applicable 
                laws and regulations. If you do not agree with any of these terms, you are prohibited from using or 
                accessing this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Use License</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Permission is granted to temporarily use HabitLink for personal, non-commercial use only. This license 
                shall automatically terminate if you violate any of these restrictions.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">Under this license, you may not:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to reverse engineer any software contained in HabitLink</li>
                <li>Remove any copyright or proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">User Accounts</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>When you create an account with us, you are responsible for:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Maintaining the security of your account and password</li>
                  <li>All activities that occur under your account</li>
                  <li>Providing accurate and complete information</li>
                  <li>Updating your information to keep it accurate</li>
                </ul>
                <p className="mt-4">
                  We reserve the right to refuse service, terminate accounts, or remove content at our sole discretion.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">User Content</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You retain all rights to any content you submit, post, or display on or through HabitLink. By posting 
                content, you grant us a license to use, modify, and display that content in connection with our service.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You represent and warrant that you own or have the necessary rights to use and authorize us to use all 
                content you submit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Prohibited Uses</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">You agree not to use HabitLink:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>In any way that violates any applicable law or regulation</li>
                <li>To transmit any harmful code, viruses, or malicious software</li>
                <li>To harass, abuse, or harm another person</li>
                <li>To impersonate or attempt to impersonate another user or person</li>
                <li>To engage in any automated use of the system</li>
                <li>To interfere with or circumvent security features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                The service and its original content, features, and functionality are owned by HabitLink and are 
                protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                The materials on HabitLink are provided on an 'as is' basis. HabitLink makes no warranties, expressed 
                or implied, and hereby disclaims and negates all other warranties including, without limitation, implied 
                warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of 
                intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Limitations of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                In no event shall HabitLink or its suppliers be liable for any damages (including, without limitation, 
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
                to use HabitLink, even if HabitLink or an authorized representative has been notified orally or in writing 
                of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may terminate or suspend your account and bar access to the service immediately, without prior notice 
                or liability, under our sole discretion, for any reason whatsoever, including without limitation if you 
                breach the Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will 
                provide at least 30 days' notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which 
                HabitLink operates, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at{" "}
                <Link to="/contact" className="text-primary hover:underline">
                  our contact page
                </Link>{" "}
                or email us at{" "}
                <a href="mailto:legal@habitlink.com" className="text-primary hover:underline">
                  legal@habitlink.com
                </a>
              </p>
            </section>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Terms;

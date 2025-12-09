import Link from "next/link";
import {
  ArrowRight,
  Wifi,
  Phone,
  Tv,
  Zap,
  Rocket,
  ShieldCheck,
  Headset,
  Sparkles,
  Check,
  Star,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section
        id="home"
        className="relative pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden"
      >
        {/* Background Mesh */}
        <div className="absolute inset-0 gradient-mesh"></div>

        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl floating"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl floating-delayed"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl"></div>

        <div className="container-tight relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
            {/* Content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">#1 VTU Platform in Nigeria</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-display mb-6">
                Pay Bills in{" "}
                <span className="gradient-text">Seconds</span>,{" "}
                <br className="hidden sm:block" />
                Not Hours.
              </h1>

              <p className="text-lg lg:text-xl text-body max-w-xl mx-auto lg:mx-0 mb-10">
                The fastest and most reliable platform for airtime, data bundles,
                electricity bills, and TV subscriptions. Instant delivery, guaranteed.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                <Link href="/register">
                  <Button size="xl" className="w-full sm:w-auto gap-2">
                    Get Started Free <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="xl" variant="secondary" className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-8 border-t border-gray-200/50">
                <div>
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-500">Happy Users</div>
                </div>
                <div className="w-px h-10 bg-gray-200 hidden sm:block"></div>
                <div>
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900">₦2B+</div>
                  <div className="text-sm text-gray-500">Transactions</div>
                </div>
                <div className="w-px h-10 bg-gray-200 hidden sm:block"></div>
                <div>
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900">99.9%</div>
                  <div className="text-sm text-gray-500">Uptime</div>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[48px] blur-3xl opacity-20 scale-90"></div>

                {/* Phone Mockup */}
                <div className="relative w-[300px] sm:w-[340px] h-[600px] sm:h-[680px] bg-gray-900 rounded-[48px] p-3 shadow-2xl floating">
                  <div className="w-full h-full bg-white rounded-[36px] overflow-hidden relative">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-2xl z-10"></div>

                    {/* Screen Content */}
                    <div className="pt-10 px-5 pb-6 h-full flex flex-col bg-gradient-to-b from-blue-50 to-white">
                      {/* App Header */}
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex gap-3 items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500"></div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">Good morning!</div>
                            <div className="text-xs text-gray-500">John Doe</div>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        </div>
                      </div>

                      {/* Wallet Card */}
                      <div className="gradient-primary rounded-3xl p-6 text-white mb-6 shadow-xl glow-blue">
                        <p className="text-xs opacity-80 mb-1 font-medium">Wallet Balance</p>
                        <h3 className="text-3xl font-bold mb-4 text-mono">₦245,000<span className="text-lg opacity-70">.00</span></h3>
                        <div className="flex gap-2">
                          <button className="bg-white/20 text-xs py-2 px-4 rounded-xl backdrop-blur-sm font-semibold hover:bg-white/30 transition-colors">
                            + Top Up
                          </button>
                          <button className="bg-white/10 text-xs py-2 px-4 rounded-xl backdrop-blur-sm font-medium hover:bg-white/20 transition-colors">
                            History
                          </button>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-4 gap-3 mb-6">
                        {[
                          { icon: Wifi, color: "blue", label: "Data" },
                          { icon: Phone, color: "green", label: "Airtime" },
                          { icon: Zap, color: "orange", label: "Power" },
                          { icon: Tv, color: "indigo", label: "TV" },
                        ].map((item, i) => (
                          <div key={i} className="flex flex-col items-center gap-2">
                            <div
                              className={`w-12 h-12 rounded-2xl bg-${item.color}-100 text-${item.color}-600 flex items-center justify-center shadow-sm`}
                              style={{
                                backgroundColor: item.color === 'blue' ? '#DBEAFE' :
                                  item.color === 'green' ? '#DCFCE7' :
                                    item.color === 'orange' ? '#FFEDD5' : '#E0E7FF',
                                color: item.color === 'blue' ? '#2563EB' :
                                  item.color === 'green' ? '#16A34A' :
                                    item.color === 'orange' ? '#EA580C' : '#4F46E5'
                              }}
                            >
                              <item.icon className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium text-gray-600">{item.label}</span>
                          </div>
                        ))}
                      </div>

                      {/* Recent Transactions */}
                      <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm font-bold text-gray-900">Recent</span>
                          <span className="text-xs text-primary font-medium">See all</span>
                        </div>
                        <div className="space-y-3">
                          {[
                            { name: "MTN Data", amount: "-₦2,500", status: "success" },
                            { name: "Airtel Airtime", amount: "-₦1,000", status: "success" },
                            { name: "Wallet Top Up", amount: "+₦50,000", status: "credit" },
                          ].map((tx, i) => (
                            <div key={i} className="flex justify-between items-center py-2">
                              <div className="flex gap-3 items-center">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tx.status === 'credit' ? 'bg-green-100' : 'bg-gray-100'}`}>
                                  <Check className={`w-4 h-4 ${tx.status === 'credit' ? 'text-green-600' : 'text-gray-600'}`} />
                                </div>
                                <span className="text-sm font-medium text-gray-700">{tx.name}</span>
                              </div>
                              <span className={`text-sm font-bold ${tx.status === 'credit' ? 'text-green-600' : 'text-gray-900'}`}>
                                {tx.amount}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container-tight">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-caption text-primary mb-4 block">SERVICES</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-headline mb-6">
              Everything you need,<br />in one place
            </h2>
            <p className="text-body text-lg">
              Fast, reliable, and affordable. Pay for all your digital services instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Wifi,
                title: "Data Bundles",
                desc: "SME & Direct data for all networks at unbeatable prices.",
                color: "blue",
                href: "/services/data"
              },
              {
                icon: Phone,
                title: "Airtime Top-up",
                desc: "Instant VTU for MTN, Glo, Airtel & 9mobile.",
                color: "green",
                href: "/services/airtime"
              },
              {
                icon: Zap,
                title: "Electricity",
                desc: "Prepaid & postpaid meter tokens delivered instantly.",
                color: "orange",
                href: "/services/electricity"
              },
              {
                icon: Tv,
                title: "SLTV",
                desc: "Super Link TV subscriptions with instant activation.",
                color: "indigo",
                href: "/services/sltv"
              },
            ].map((service, i) => (
              <Link key={i} href={service.href}>
                <div className="card p-8 h-full cursor-pointer group">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110`}
                    style={{
                      backgroundColor: service.color === 'blue' ? '#DBEAFE' :
                        service.color === 'green' ? '#DCFCE7' :
                          service.color === 'orange' ? '#FFEDD5' : '#E0E7FF',
                      color: service.color === 'blue' ? '#2563EB' :
                        service.color === 'green' ? '#16A34A' :
                          service.color === 'orange' ? '#EA580C' : '#4F46E5'
                    }}
                  >
                    <service.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-body">{service.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28 gradient-mesh">
        <div className="container-tight">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-caption text-primary mb-4 block">WHY CHOOSE US</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-headline mb-6">
              Built for speed,<br />designed for trust
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: Rocket,
                title: "Lightning Fast",
                desc: "Transactions complete in under 5 seconds. No waiting, instant value delivery."
              },
              {
                icon: ShieldCheck,
                title: "Bank-Level Security",
                desc: "Your data is protected with enterprise-grade encryption and security."
              },
              {
                icon: Headset,
                title: "24/7 Support",
                desc: "Our dedicated team is always available to help you with any issues."
              },
            ].map((feature, i) => (
              <div key={i} className="text-center p-8">
                <div className="w-20 h-20 mx-auto bg-white rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                  <feature.icon className="w-9 h-9 text-primary" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h4>
                <p className="text-body">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="container-tight">
          <div className="relative gradient-hero rounded-[32px] lg:rounded-[48px] p-10 md:p-16 lg:p-20 text-center text-white overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-8">
                <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                <span className="text-sm font-semibold">Rated 4.9/5 by 10,000+ users</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Ready to get started?
              </h2>
              <p className="text-lg lg:text-xl opacity-90 mb-10 max-w-xl mx-auto">
                Join thousands of Nigerians who trust SwiftVTU for their daily digital payments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="xl" variant="white" className="w-full sm:w-auto gap-2 text-primary">
                    Create Free Account <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Networks */}
      <section className="py-16">
        <div className="container-tight">
          <p className="text-center text-caption mb-8">TRUSTED BY ALL MAJOR NETWORKS</p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-60">
            {["MTN", "Airtel", "Glo", "9mobile", "SLTV"].map((network, i) => (
              <div
                key={i}
                className="px-6 py-3 text-lg font-bold text-gray-600 hover:text-primary transition-colors cursor-default"
              >
                {network}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

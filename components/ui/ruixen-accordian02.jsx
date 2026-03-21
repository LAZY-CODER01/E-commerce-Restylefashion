"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Accordion_02() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-24 md:py-32">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        {/* Left Column */}
        <div className="lg:w-1/3">
          <h2 className="text-[32px] md:text-[42px] font-extrabold text-[#2F2F2F] leading-tight mb-6">
            Have questions?
          </h2>
          <p className="text-gray-500 text-[16px] md:text-[18px] font-medium leading-relaxed">
            We are here to help you understand how everything works. If you still have
            doubts, feel free to{" "}
            <a href="/contact" className="text-brand-pink font-bold underline hover:text-brand-pink-hover transition-colors underline-offset-4">
              reach out to our team
            </a>
            .
          </p>
        </div>

        {/* Right Column */}
        <div className="lg:w-2/3 space-y-12">
          {/* General Section */}
          <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 p-8 md:p-10 text-[#2F2F2F]">
            <h3 className="text-[14px] font-extrabold text-[#F7246E] uppercase tracking-widest mb-6">
              General
            </h3>
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="gen-1">
                <AccordionTrigger className="text-[18px] text-[#2F2F2F]">
                  What is the purpose of this platform?
                </AccordionTrigger>
                <AccordionContent className="text-[15px] text-gray-500">
                  Our platform is designed to simplify your workflow and save you hours every week using automation and AI-powered tools.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="gen-2">
                <AccordionTrigger className="text-[18px] text-[#2F2F2F]">
                  Is this service available worldwide?
                </AccordionTrigger>
                <AccordionContent className="text-[15px] text-gray-500">
                  Yes, we support users across the globe. Some regional features may vary.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Billing Section */}
          <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 p-8 md:p-10 text-[#2F2F2F]">
            <h3 className="text-[14px] font-extrabold text-[#F7246E] uppercase tracking-widest mb-6">
              Billing
            </h3>
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="bill-1">
                <AccordionTrigger className="text-[18px] text-[#2F2F2F]">
                  Do you offer refunds?
                </AccordionTrigger>
                <AccordionContent className="text-[15px] text-gray-500">
                  Yes, we offer a 7-day refund policy. If you're unsatisfied, just contact our support within that time frame.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="bill-2">
                <AccordionTrigger className="text-[18px] text-[#2F2F2F]">
                  Can I change my plan later?
                </AccordionTrigger>
                <AccordionContent className="text-[15px] text-gray-500">
                  Absolutely! You can upgrade or downgrade your plan anytime from your account dashboard.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Technical Section */}
          <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 p-8 md:p-10 text-[#2F2F2F]">
            <h3 className="text-[14px] font-extrabold text-[#F7246E] uppercase tracking-widest mb-6">
              Technical
            </h3>
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="tech-1">
                <AccordionTrigger className="text-[18px] text-[#2F2F2F]">
                  Does this integrate with other tools?
                </AccordionTrigger>
                <AccordionContent className="text-[15px] text-gray-500">
                  Yes! We support integrations with Slack, Notion, Zapier, and many more.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="tech-1">
                <AccordionTrigger className="text-[18px] text-[#2F2F2F]">
                  Does this integrate with other tools?
                </AccordionTrigger>
                <AccordionContent className="text-[15px] text-gray-500">
                  Yes! We support integrations with Slack, Notion, Zapier, and many more.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="tech-2">
                <AccordionTrigger className="text-[18px] text-[#2F2F2F]">
                  Is there an API available?
                </AccordionTrigger>
                <AccordionContent className="text-[15px] text-gray-500">
                  Yes, our public API is available for all Pro users. Documentation can be found in the developer portal.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}

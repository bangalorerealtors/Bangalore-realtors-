import { Icon } from '@iconify/react';
import Image from 'next/image';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const FAQ: React.FC = () => {
    return (
        <section id='faqs'>
            <div className='container max-w-8xl mx-auto px-5 2xl:px-0'>
                <div className="grid lg:grid-cols-2 gap-10 ">
                    <div className='lg:mx-0 mx-auto'>
                        <Image
                            src="/images/faqs/faq-image.png"
                            alt='image'
                            width={680}
                            height={644}
                            className='lg:w-full'
                            unoptimized={true}
                        />
                    </div>
                    <div className='lg:px-12'>
                        <p className="text-dark/75 dark:text-white/75 text-base font-semibold flex gap-2">
                            <Icon icon="ph:house-simple-fill" className="text-2xl text-primary " />
                            FAQs
                        </p>
                        <h2 className='lg:text-52 text-40 leading-[1.2] font-medium text-dark dark:text-white'>
                            Everything about Bangalore Realtors
                        </h2>
                        <p className='text-dark/50 dark:text-white/50 pr-20'>
                            Navigating real estate can be complex. We believe every client deserves honest, informed answers — not sales pitches. Below are the questions we hear most often. If yours isn&apos;t here, we are a call away.
                        </p>
                        <div className="my-8">
                            <Accordion type="single" defaultValue="item-1" collapsible className="w-full flex flex-col gap-6">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>1. Which areas in Bangalore do you cover?</AccordionTrigger>
                                    <AccordionContent>
                                        We cover every major locality — Whitefield, Koramangala, Indiranagar, HSR Layout, Electronic City, Sarjapur Road, Hebbal, Devanahalli, and beyond. Whether you seek a home in the heart of the city or on its most promising frontiers, our advisors know every neighbourhood we recommend.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>2. What types of properties do you list?</AccordionTrigger>
                                    <AccordionContent>
                                        Our portfolio spans apartments, villas, villa developments and plots. Every listing meets our verification standards and is K-RERA compliant.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>3. How do I schedule a site visit?</AccordionTrigger>
                                    <AccordionContent>
                                        Simply reach out via phone, email, or the enquiry form. We will schedule a visit at your convenience, accompanied by a locality specialist who can guide you beyond the brochure.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4">
                                    <AccordionTrigger>4. Do you assist with home loans and legal verification?</AccordionTrigger>
                                    <AccordionContent>
                                        Yes, comprehensively. We coordinate with leading banks and NBFCs for home loan facilitation and provide thorough legal due diligence — covering title verification, encumbrance checks, and registration support.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-5">
                                    <AccordionTrigger>5. Are your listed properties RERA registered?</AccordionTrigger>
                                    <AccordionContent>
                                        Without exception. Every project is registered under K-RERA. We verify developer track records and project documentation before presenting any property to our clients.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;

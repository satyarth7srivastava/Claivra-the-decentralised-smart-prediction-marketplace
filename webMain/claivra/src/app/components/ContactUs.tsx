const ContactUs : React.FC = () => {
    return (
        <div className="flex flex-col justify-center bg-[#f6f6e6] items-center py-10 pd:my-24 my-20 pd:my-24 ">
            <h1 className="text-3xl font-bold text-primaryBlue mb-10">Contact Us</h1>
            <div className="w-full px-10 sm:px-16 md:px-28">
                <div className="flex justify-start items-start flex-col gap-32">
                    {/* left side */}
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-grey">Address</label>
                            <h1 className="text-sm text-primaryBlack">Patna University Campus, Patna, Bihar 800005</h1>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-grey">Phone number</label>
                            <h1 className="text-sm text-primaryBlack">+91 92582 69833</h1>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-grey">Email address</label>
                            <h1 className="text-sm text-primaryBlack">prishagarg06@gmail.com</h1>
                        </div>
                    </div>
                    {/* icons */}
                    <div className="flex gap-8 pl-1">
                        <img src="/github.png" width={18}></img>
                        <img src="/facebook.png" width={18}></img>
                        <img src="/linkedin.png" width={18}></img>
                        <img src="/twitter.png" width={18}></img>
                    </div>
                </div>
                {/* map */}
                <div>
                    
                </div>
            </div>
        </div>
    )
}

export default ContactUs;
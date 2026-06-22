
import Footer from '../components/Footer'

import WhyAjaiSikam from '../components/WhyAjaiSikam'
// import BadgeSection from '../components/BadgeSection'
import HeroSection from '../components/HeroSection'
import AppNavbar from '../components/Navbar'
import HowItWorks from '../components/HowItWorks'

function LandingPage(){
    return(
        <div>
            <AppNavbar />

            <HeroSection />
            <HowItWorks />
            <WhyAjaiSikam />
            <Footer />


        </div>

        
    )
}

export default LandingPage
import AppNavbar from "./Navbar";

function MainLayout({ children }){
    return(
        <>
        <AppNavbar />
        {children}
        
        </>
    )
}

export default MainLayout
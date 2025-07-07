import { Link } from 'react-router-dom'
import './page-misc.css'
const NotFound = () => {
    return (
        <>
            <div className="misc-wrapper">
                <h2 className="mb-2 mx-2">Page introuvable :(</h2>
                <p className="mb-4 mx-2">Oops! 😖 L`&apos;URL demandée n`&apos;a pas été trouvée sur ce serveur.</p>
                <Link aria-label='Go to Home Page' to="/" className="btn btn-primary">Retour</Link>
                <div className="mt-3">
                    <img
                        src="../assets/img/illustrations/page-misc-error-light.png"
                        alt="page-misc-error-light"
                        aria-label="page misc error light"
                        width="500"
                        className="img-fluid"
                        data-app-dark-img="illustrations/page-misc-error-dark.png"
                        data-app-light-img="illustrations/page-misc-error-light.png" />
                </div>
            </div>
        </>
    )
}

export default NotFound;
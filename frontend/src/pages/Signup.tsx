import Auth from "../components/Auth"
import Quotes from "../components/Quotes"

const Signup = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
        <div>
            <Auth type="signup"/>
        </div>
        <div className="hidden lg:block">
        <Quotes type="signup"/>
        </div>
    </div>
  )
}

export default Signup
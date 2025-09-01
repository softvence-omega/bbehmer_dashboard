import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"
import { Button } from "../../components/ui/button"

const ErrorPage =() =>{

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-black flex items-center justify-center px-4"
    >
      <div className="bg-zinc-900 p-8 rounded-xl max-w-md w-full text-center shadow-lg">
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 3 }}
          className="flex justify-center mb-4"
        >
          <AlertTriangle className="text-yellow-400 h-14 w-14" />
        </motion.div>

        <h1 className="text-3xl font-bold text-white mb-2">Oops! Something went wrong</h1>
        <p className="text-zinc-400 text-sm mb-6">
          The page you're looking for might be unavailable or the link is broken.
        </p>

        <Button
          className="w-full bg-yellow-400 text-black font-semibold hover:bg-yellow-300"
        >
          Go Back Home
        </Button>
      </div>
    </motion.div>
  )
}

export default ErrorPage;
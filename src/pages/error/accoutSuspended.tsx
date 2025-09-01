
import { motion } from "framer-motion"
import { OctagonMinus } from "lucide-react"
import { Button } from "../../components/ui/button"

const AccoutSuspend =() =>{
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen bg-black flex items-center justify-center px-4"
    >
      <div className="max-w-md w-full bg-zinc-900 rounded-xl p-8 text-center shadow-lg">
        <div className="flex justify-center mb-4">
          <OctagonMinus  className="h-12 w-12 text-yellow-400 animate-pulse" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Account Has Been Suspended</h2>
        <p className="text-sm text-zinc-400 mb-6">
          Due to some rules violation your Account has been Suspended. Contact to Support
        </p>

        <Button
          className="w-full bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition"
        >
          Go to Support
        </Button>
      </div>
    </motion.div>
  )
}

export default AccoutSuspend;

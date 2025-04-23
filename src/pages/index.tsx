import { ChakraProvider, Box, Heading, Text, Button, Stack, Flex, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { Roboto } from "next/font/google";
import HeroCarousel from "components/Hero";

const roboto = Roboto({
  display: "swap",
  weight: ["100", "300", "400", "500", "700", "900"],
  preload: true,
  subsets: ["latin-ext"],
  adjustFontFallback: true,
  fallback: ["sans-serif"],
});

// 🎨 Background SVG Pattern
const BackgroundPattern = () => (
  <svg className="absolute top-0 left-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M80 0H0v80" fill="none" stroke="gray" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);


const HeroSection = () => {
  const router = useRouter();

  return (
    <Box as="section" className="relative bg-gray-900 text-white py-20 px-6 text-center overflow-hidden">
      <BackgroundPattern />
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-4xl mx-auto"
      >
        <Heading as="h1" size="2xl" className="font-bold leading-tight">
          Transparent Governance, Empowered Citizens
        </Heading>
        <Text className="mt-4 text-lg text-gray-300">
          A platform to track government projects, engage with citizens, and ensure transparency in public initiatives.
        </Text>
        <Stack direction="row" spacing={4} justify="center" className="mt-6">
          <Button
            colorScheme="teal"
            size="lg"
            className="shadow-lg hover:scale-105 transition-transform"
            onClick={() => router.push("/home")}
          >
            Explore Projects
          </Button>
          <Button
            variant="outline"
            colorScheme="teal"
            size="lg"
            className="hover:bg-teal-500 hover:text-white transition-all"
            onClick={() => router.push("/signup")}
          >
            Get Started
          </Button>
        </Stack>
      </motion.div>
    </Box>
  );
};
function Testimonials() {
  return (
    <Box className="bg-gray-100 py-20 px-6 text-center">
      <Heading as="h2" size="xl" className="font-bold">
        What People Say
      </Heading>
      <Stack spacing={8} className="mt-10 max-w-3xl mx-auto">
        <Testimonial
          name="Ravi Kumar"
          text="This platform has completely transformed how we track public projects!"
          image="/man.svg"
        />
        <Testimonial
          name="Ananya Singh"
          text="I feel more empowered as a citizen knowing where my tax money is going."
          image="/woman.svg"
        />
      </Stack>
    </Box>
  );
}

// 💬 Testimonial Card
function Testimonial({ name, text, image }: { name: string; text: string; image: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-all"
    >
      <Image src={image} width={60} height={60} alt={name} className="mb-4 rounded-full" />
      <Text fontSize="lg" fontStyle="italic">
        {text}
      </Text>
      <Text fontSize="sm" fontWeight="bold" className="mt-2">
        - {name}
      </Text>
    </motion.div>
  );
}
function FeatureCard({ title, description, svgPath }: { title: string; description: string; svgPath: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-all"
    >
      <Image src={svgPath} width={60} height={60} alt={title} className="mb-4" />
      <Heading as="h3" size="md" mb={3} fontWeight="semibold">
        {title}
      </Heading>
      <Text fontSize="sm">{description}</Text>
    </motion.div>
  );
}
function FeaturesSection() {
  return (
    <Box bg="gray.50" py={20} px={8} textAlign="center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <Heading as="h2" size="xl" mb={6} fontWeight="semibold" color="gray.800">
          Key Features
        </Heading>
        <Text fontSize="md" maxW="600px" mx="auto" mb={12} color="gray.600">
          Explore the features that make our platform stand out and create a more transparent world.
        </Text>
      </motion.div>

      <Flex wrap="wrap" justify="center" gap={8}>
        <FeatureCard
          title="Real-Time Updates"
          description="Stay informed with live updates on government projects."
          svgPath="/real-updates.svg"
        />
        <FeatureCard
          title="Public Engagement"
          description="Empower citizens to give feedback, vote, and report issues."
          svgPath="/public-talk.svg"
        />
        <FeatureCard
          title="Secure & Anonymous Reporting"
          description="Ensure corruption reports remain confidential."
          svgPath="/security.svg"
        />
        <FeatureCard
          title="Geotagged Projects"
          description="View projects on an interactive OpenStreetMap."
          svgPath="/geotag.svg"
        />
      </Flex>
    </Box>
  );
}
const CallToAction = () => {
  const router = useRouter();

  return (
    <Box bg="teal.600" color="white" py={16} textAlign="center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <Heading as="h2" size="xl" fontWeight="bold">
          Join the Movement for Transparent Governance
        </Heading>
        <Text fontSize="lg" mt={4} maxW="600px" mx="auto">
          Register now to track projects, report concerns, and shape the future of governance.
        </Text>
        <Button
          size="lg"
          mt={6}
          colorScheme="whiteAlpha"
          className="hover:scale-105 transition-transform"
          onClick={() => router.push("/signup")}
        >
          Sign Up Now
        </Button>
      </motion.div>
    </Box>
  );
};

// 🏡 Home Page Component
export default function Home() {
  const router = useRouter();

  return (
    <ChakraProvider>
      <HeroCarousel />
      <HeroSection />
      <FeaturesSection />
      <Testimonials />
      <CallToAction />
    </ChakraProvider>
  );
}

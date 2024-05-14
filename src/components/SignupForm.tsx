import { Button, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import apiClient from "../services/api-client";
import { Link, useNavigate } from "react-router-dom";
import "./AuthForm.css";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleClick = () => {
    apiClient.auth.signUp({ email, password }).then((res) => {
      console.log(res.data);
      navigate("/");
    });
  };

  return (
    <form>
      <VStack spacing="18px" padding="10px" maxWidth="560px" margin="24px auto">
        <Heading>Create a new account</Heading>
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleClick} colorScheme="blue">
          Sign up
        </Button>
        <Text>
          Already have account?{" "}
          <Link className="link" to="/signin">
            Sign in
          </Link>
        </Text>
      </VStack>
    </form>
  );
};

export default SignupForm;

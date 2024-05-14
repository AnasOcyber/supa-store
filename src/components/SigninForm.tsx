import { Button, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import apiClient from "../services/api-client";
import "./AuthForm.css";
import { Link, useNavigate } from "react-router-dom";

const SigninForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleClick = () => {
    apiClient.auth.signInWithPassword({ email, password }).then((res) => {
      console.log(res.data);
      navigate("/");
    });
  };

  return (
    <form>
      <VStack spacing="18px" padding="10px" maxWidth="560px" margin="24px auto">
        <Heading>Sign in to your account</Heading>
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
          Sign in
        </Button>
        <Text>
          Don't have account?{" "}
          <Link className="link" to="/signup">
            Sign Up
          </Link>
        </Text>
      </VStack>
    </form>
  );
};

export default SigninForm;

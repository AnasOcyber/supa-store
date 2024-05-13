import { Button, Input, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import apiClient from "../services/api-client";
import { Link } from "react-router-dom";
import "./AuthForm.css";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleClick = () => {
    apiClient.auth
      .signUp({ email, password })
      .then((res) => console.log(res.data));
  };

  return (
    <form>
      <VStack spacing="18px" padding="10px">
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

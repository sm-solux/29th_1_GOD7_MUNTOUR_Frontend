import { useState } from "react";
import Box from "../components/Box";
import Button from "../components/Button";
import styled from "styled-components";
import Header from "../components/Header";
import Id from "../assets/TextInputimg/id.png";
import Pw from "../assets/TextInputimg/pw.png";
import CheckPw from "../assets/TextInputimg/check.png";
import axios from "axios";
import TextInput from "../components/TextInput";
import Modal from "../components/Modal";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  height: 700px;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: bold;
  font-size: 20px;
  margin: 10px 0px 30px 0px;
`;

const Textarea = styled.input`
  font-size: 16px;
  line-height: 20px;
  border: none;
  border-radius: 3px;
  margin: 5px 20px;
  padding: 10px;
  resize: none;
  background-color: #eeeeee;
  width: 350px;
  height: 45px;
  outline: none;

  &::placeholder {
    font-size: 13px;
    color: #9e9e9e;
    background: url(${(props) => props.img || Id}) no-repeat left center;
    background-size: contain;
    padding-left: 30px;
    line-height: 1.5;
  }
`;

const NewButton = styled(Button)`
  &&& {
    padding: 10px 30px;
    font-size: 14px;
    margin: 5px;
  }
`;

const Divider = styled.div`
  width: 350px;
  height: 1px;
  background-color: #CCC;
  margin: 15px 0;
`;

// const Modal = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   background-color: rgba(0, 0, 0, 0.5);
// `;

// const ModalContent = styled.div`
//   background-color: white;
//   padding: 20px;
//   border-radius: 10px;
//   box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
//   text-align: center;
// `;

// const CloseButton = styled.button`
//   margin-top: 10px;
//   padding: 5px 10px;
//   border: none;
//   background-color: #85a1e8;
//   color: white;
//   border-radius: 5px;
//   cursor: pointer;

//   &:hover {
//     background-color: #6a8bd8;
//   }
// `;

function PwFind(props) {
  const { title, onClick, disabled, className } = props;
  const [isIdValid, setIsIdValid] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleIdCheck = () => {
    axios
      .get(`http://localhost:3000/auth/signup`, { params: { id } })
      .then((response) => {
        if (response.data.exists) {
          setIsIdValid(true);
          setPassword(response.data.password);
          setModalMessage("존재하는 아이디입니다.");
        } else {
          setIsIdValid(false);
          setModalMessage("존재하지 않는 아이디입니다.");
        }
        setShowModal(true);
      })
      .catch((error) => {
        setModalMessage("아이디 확인이 완료되었습니다.");
        setShowModal(true);
        console.error(error);
      });
    };

  const handlePasswordReset = () => {
    if (password !== confirmPassword) {
      setModalMessage("비밀번호가 일치하지 않습니다.");
      setShowModal(true);
      return;
    }

    axios
      .post("http://localhost:3000/auth/sign-in", { id, password })
      .then((response) => {
        setModalMessage("비밀번호가 ㄴㄴ성공적으로 재설정되었습니다.");
        setShowModal(true);
      })
      .catch((error) => {
        setModalMessage("비밀번호가 성공적으로 재설정되었습니다.");
        setShowModal(true);
        console.error(error);
      });
  };

  return (
    <Wrapper>
      <Header />
      <Box>
        <Text>비밀번호 재설정</Text>
        <TextInput
          type="text"
          img={Id}
          placeholder="아이디"
          value={id}
          onChange={(event) => setId(event.target.value)}
        />
        <NewButton title="아이디 확인" onClick={handleIdCheck} disabled={disabled} />
        <Divider />
        <TextInput
          type="password"
          img={Pw}
          placeholder="비밀번호"
          maxLength={12}
          disabled={!isIdValid}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <TextInput
          type="password"
          img={CheckPw}
          placeholder="비밀번호 확인"
          maxLength={12}
          // disabled={!isIdValid}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
        <NewButton
          title="비밀번호 재설정"
          onClick={handlePasswordReset}
          disabled={!isIdValid || disabled}
        />
      </Box>

      {showModal && <Modal message={modalMessage} onClick={() => setShowModal(false)}/>}

    </Wrapper>
  );
}

export default PwFind;

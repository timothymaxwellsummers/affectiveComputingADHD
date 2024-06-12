import styled from 'styled-components';

export const ClickButton = styled.div`
    background: powderblue;
    padding: 10px;
    margin-left: auto;
    margin-right: auto;
    cursor: pointer;
    width: 90px;
    height: 40px;
    text-align: center;
`
const PopupCard = styled.div`
  width: 300px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -150px;
  background-color: white;
  padding: 40px;
  transform: translateY(-50%);

  /* Speech Bubble Styling */
  border-radius: 15px; /* Rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  position: relative; /* For positioning the triangle */

  &:after { /* The triangle "tail" */
    content: "";
    position: absolute;
    bottom: -20px; /* Adjust position as needed */
    left: 50%;
    transform: translateX(-50%) rotate(0deg);
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-top: 20px solid white; /* Match background color */
  }
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background-color: black;
  background-color: rgba(0, 0, 0, 0.75);
`;

type PopupProps = {
    showPopup: boolean;
    togglePopup: () => void; // Simplified the type here
};

export const Popup = ({ showPopup, togglePopup }: PopupProps) => {
    if (!showPopup) return null; // Don't render if not visible

    return (
        <Overlay>
            <PopupCard>
                <p>Sitze ich aufrecht? Sind meine Füße auf dem Boden? Ich schaue genau zu und höre genau hin.</p>
                <ClickButton onClick={togglePopup}>Close</ClickButton>
            </PopupCard>
        </Overlay>
    );
};
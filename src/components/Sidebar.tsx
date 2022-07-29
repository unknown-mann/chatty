import React, { useState } from "react";
import styled from "styled-components";
import Rooms from "./Rooms";
import Friends from "./Friends";

const Wrapper = styled.aside<{ mobile: boolean }>`
  position: ${props => props.mobile ? 'absolute' : 'relative'};
  width: ${props => props.mobile ? '300px' : ''};
  height: 100%;
  @media (max-width: 768px) {
    height: 103%;
  }
  background-color: #f2f2f2;
  border-right: 1px solid #dadee0;
  z-index: 1;
`;

const SelectTab = styled.div`
  height: 61px;
  display: flex;
  justify-content: space-between;
`;

const TabType = styled.span<{ active: boolean }>`
  display: inline-block;
  width: 50%;
  padding: 25px;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.active ? '#0b829e' : '#1ca1c1'};
  border-bottom: ${props => props.active ? '2px solid #0b829e' : ''};
  text-align: center;
  cursor: pointer;
`;

const TabContent = styled.div<{ active: boolean }>`
  display: ${props => props.active ? 'block' : 'none'};
  width: 100%;
  position: absolute;
  top: 60px;
  overflow: auto;
`;

type PropsType = {
  active: boolean,
  mobile: boolean,
  setActive: (arg: boolean) => void
}

const Sidebar: React.FC<PropsType> = React.memo(({ active, setActive, mobile }) => {

  const [activeTab, setActiveTab] = useState(2)

  const toggleTab = (index: number) => setActiveTab(index)

  return (
    <Wrapper mobile={mobile} className={active ? "show" : "hide"}>
      <SelectTab>
        <>
          <TabType active={activeTab === 1} onClick={() => { toggleTab(1) }}>FRIENDS</TabType>
          <TabContent active={activeTab === 1}>
            <Friends />
          </TabContent>
        </>
        <>
          <TabType active={activeTab === 2} onClick={() => toggleTab(2)}>CHATS</TabType>
          <TabContent active={activeTab === 2}>
            <Rooms mobile={mobile} setActive={setActive} />
          </TabContent>
        </>
      </SelectTab>
    </Wrapper>
  )

});

export default Sidebar;
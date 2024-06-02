import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

export default function Patchnotes() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
      <Button onPress={onOpen} className="pb-[2vh] mx-[1vw] w-[100px] bg-transparent text-white ">patch notes</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">patch 2.5</ModalHeader>
              <ModalBody>
                <h2 className="font-extrabold">added features</h2>
                <p className="text-sm"> 
                  - seamless switching between custom game and trending songs
                </p>
                <p className="text-sm"> 
                  - immediate spotify fetching to reduce loading time
                </p>
                <p className="text-sm"> 
                  - hip hop and edm genre expanded
                </p>

                <br></br>
                <h2 className="font-extrabold">bug fixes</h2>
                <p className="text-sm"> 
                  - fixed audio being really loud on game mode switch
                </p>
                <p className="text-sm"> 
                  - fixed average score calculation
                </p>
                <p className="text-sm"> 
                  - fixed leaderboard updating when its not supposed to
                </p>
                <p className="text-sm"> 
                  - fixed genre checkbox bug
                </p>

              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
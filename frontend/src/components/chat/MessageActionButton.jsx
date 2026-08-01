import { useRef } from "react";
import { MoreVertical } from "lucide-react";
import { useMessageMenu } from "../../context/MessageMenuContext";
const MessageActionButton = ({ own, message }) => {
    const buttonRef = useRef(null);
    const { openMenu } = useMessageMenu();
    const handleClick = (e) => {
        e.stopPropagation();
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        openMenu( message,
            rect.left,
            rect.bottom + 6
        );
    };
    return (
        <button
            ref={buttonRef}
            onClick={handleClick}
            className="opacity-0 group-hover:opacity-100 transition duration-200 absolute top-2 h-8 w-8 rounded-fullbg-zinc-900/90 border border-zinc-700 shadow-lg flex items-center justify-center hover:bg-zinc-800"
            style={
                own
                    ? { left: "-38px" }
                    : { right: "-38px" }
            }
        >
            <MoreVertical
                size={16}
                className="text-zinc-300"
            />
        </button>
    );
};
export default MessageActionButton;
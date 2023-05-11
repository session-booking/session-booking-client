import {CSSTransition, SwitchTransition} from 'react-transition-group';
import {ContentType} from "../enums/ContentType";
import {TRightSidebarProps} from "../types/props/TRightSidebarProps";

function RightSidebar({content}: TRightSidebarProps) {
    return (
        <SwitchTransition mode="out-in">
            <CSSTransition
                key={content}
                timeout={200}
                classNames="fade"
                unmountOnExit
            >
                <div>
                    {content === ContentType.QR_CONTENT && <Content1/>}
                    {content === ContentType.NOTIFICATION_CONTENT && <Content2/>}
                    {content === ContentType.SETTINGS_CONTENT && <Content3/>}
                </div>
            </CSSTransition>
        </SwitchTransition>
    )
}

function Content1() {
    return <p>Content 1</p>
}

function Content2() {
    return <p>Content 2</p>
}

function Content3() {
    return <p>Content 3</p>
}

export default RightSidebar;
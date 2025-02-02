import UselessBlob from 'useless-blobs/lib/components';
import Image from 'next/image'
import Link from 'next/link'
import InterfaceFooter from "@/app/i18n/Footer"
import "./style.scss"

type downloadResume = () => void;

const LinkedinIcon = "/images/linkedin_icon.svg"
const MailIcon = "/images/mail_icon.svg"
const GithubIcon = "/images/github_icon.svg"

const email = 'helioperesmartinsneto@gmail.com'
const subject = 'PROFILE LINK | <Seu assunto aqui>'
const body = 'Olá Hélio! \n <seu assunto aqui>'

export default function Footer({language, isMobile=false, downloadResume}:{language:InterfaceFooter, isMobile?: boolean, downloadResume:downloadResume}){
    return (
        <footer>
            <div className="content-title">
                <span className="text title footerTitle">{language.title}</span>
            </div>
            <div className="content-subtitle">
                <p className="text subtext footerParagraph" dangerouslySetInnerHTML={{__html: language.subText}}/>
            </div>
            <div className="content">
                <div className="content-social-information">
                    <div className="content-information">
                        <Image src={MailIcon} alt={'email'} width={80} height={80}/>
                        <Link href={`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`} target="_blank" rel="noopener noreferrer">
                            <span className='text informationText'>helioperesmartinsneto@gmail.com</span>
                        </Link>
                    </div>
                    <div className="content-information">
                        <Image src={LinkedinIcon} alt={'linkedin'} width={80} height={80}/>
                        <Link href={"https://www.linkedin.com/in/h%C3%A9lio-peres-martins-neto-b94153200/"}target="_blank" rel="noopener noreferrer">
                            <span className='text informationText'>Hélio Peres Martins Neto</span>
                        </Link>
                    </div>
                    <div className="content-information">
                        <Image src={GithubIcon} id="github" alt={'github'} width={80} height={80}/>
                        <Link href={"https://github.com/heliopmart"} target="_blank" rel="noopener noreferrer">
                            <span className='text informationText'>@heliopmart</span>
                        </Link>
                    </div>
                </div>
                <div className="content-resume">
                    <div className="resume">
                        <UselessBlob
                            fill='#6380B0'
                            stroke='none'
                            verts={12}
                            height={isMobile ? 350 : 450}
                            width={isMobile ? 300 : 400}
                            irregularity={0.1}
                            spikiness={0.3  }
                            boundingShape='rectangle'
                        />
                        <div className="content-resume">
                            <h3 className='text title resumeTitle'>{language.resumeTitle}</h3>
                            <button onClick={downloadResume} className='text buttonResume' title={language.resumeButton}>{language.resumeButton}</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content-web-information">
                <Link href={"https://github.com/heliopmart/SyncProfileProjects/tree/main/profileweb"} target="_blank" rel="noopener noreferrer">
                    <span className='text clickAnimate webInformationText'>This profile in GitHub</span>
                </Link>
                |
                <Link href={"https://github.com/heliopmart/SyncProfileProjects/tree/main/WindowsApp"} target="_blank" rel="noopener noreferrer">
                    <span className='text clickAnimate webInformationText'>GITHUB Connection Software</span>
                </Link>
                |
                <Link href={"https://undraw.co/illustrations"} target="_blank" rel="noopener noreferrer">
                    <span className='text clickAnimate webInformationText'>Images reference</span>
                </Link>
                |
                <span className='text webInformationText'>Created in NEXT.TS</span>
                |
                <span className='text webInformationText'>Created by Hélio Martins</span>
            </div>
        </footer>
    )
}
'use client'
import {useEffect, useState} from 'react'
import {Firebase, Analytics} from '@/app/functions/functions'
import {AuthWithouHook, refreshToken} from '@/app/hooks/useAuth'
import {backendConfig} from '@/app/config/backendConfig'
import { useParams } from 'next/navigation'; 
import './style.scss';

// interface

type Type = 'software' | 'mechanic'

// import component
import {HeaderProject, SectionHeaderProjectImage, AboutProject, SectionAboutProjectImage, Footer, FileAndProject} from '@/app/components/components'

// interface

import ProjectData, {ProjectDataMechanic, ProjectDataSoftware, GithubData} from "@/app/interfaces/ProjectData"

// import languages json

import HeaderProjectBr from '@/app/i18n/HeaderProject_br.json'
import HeaderProjectUs from '@/app/i18n/HeaderProject_us.json'
import AboutProjectBr from '@/app/i18n/AboutProject_br.json'
import AboutProjectUs from '@/app/i18n/AboutProject_us.json'
import LanguagesFooterBr from '@/app/i18n/Footer_br.json'
import LanguagesFooterUs from '@/app/i18n/Footer_us.json'
import LanguagesFileAndProjectBr from '@/app/i18n/FileAndProject_br.json'
import LanguagesFileAndProjectUs from '@/app/i18n/FileAndProject_us.json'
const LanguageWarningMobile = {br: {text: "O gerencimento dos arquivos não estão disponiveis no mobile"}, us: {text: "File management is not available on mobile"}}

// get github project by id
async function getGitHubProjectById(id:string){  
    try{
        const _auth = await AuthWithouHook()

        if(!_auth.auth || !_auth.data){
            return;
        }

        const res = await fetch(backendConfig.BackendUrlRoot+"/github/repo/id", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_auth.token}`,
                "nonce": _auth.data.nonce()
            },
            body: JSON.stringify({
                device: _auth.data.device,
                repoId: id
            })
        });
        const data = await res.json();

        if(!data.status){
            console.error("Error: ", data.message)
            return null
        }

        refreshToken(data.token)
        const informationProject = data.data

        return {
            name: informationProject.name,
            description: informationProject.description,
            download_url: informationProject.download_url,
            html_url: informationProject.html_url,
            languages_url: informationProject.languages_url,
            created_at: informationProject.created_at,
            pushed_at: informationProject.pushed_at,
            creationTime: differenceMonth(informationProject.created_at,  informationProject.pushed_at)
        } as GithubData

    }catch(error){
        console.error("getGithubProjectById Error: ", error)
        return null
    }
}

async function getLanguagesUsed(languages_url:string): Promise<string[] | null>{    
    try{
        const _auth = await AuthWithouHook()

        if(!_auth.auth || !_auth.data){
            return null;
        }

        const res = await fetch(backendConfig.BackendUrlRoot+"/github/repo/languages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${_auth.token}`,
                "nonce": `${_auth.data.nonce()}`
            },
            body: JSON.stringify({
                device: _auth.data.device,
                url: languages_url
            })
        });
        const data = await res.json();

        if(!data.status){
            console.error("Error: ", data.message)
            return null
        }

        refreshToken(data.token)
        return data.data

    }catch(error){
        console.error("getGithubProjectById Error: ", error)
        return null
    }
}

// get firebase project by id
async function getFirebaseProjectById(id:string){
    const data = await new Firebase().getById(id)

    /*
        NO aplicativo WINDOWS APP, quando fazer o upload de um arquivo, fazer o link de compartilhamento e adicionar ao firebase
        No site, 
            Pegar esse link e o nome do link 
            [
                {
                    name: "file.word"
                    share: "https://app.box.com/s/kwkfcmpfbp84g5om3xyx4o7mb1esiw7f"
                }
            ]
    */
    if(data){
        const url_readme = data?.url_readme.includes(".") ? data.url_readme.split(".")[0] : data?.url_readme

        return {
            id: id,
            AsyncTime: data.AsyncTime,
            creationTime: differenceMonth(data.DateTime, data.AsyncTime),
            DateTime: data.DateTime,
            FolderId: data.FolderId,
            name: data.Name,
            url_readme: url_readme || "", 
            metaDataProject: {
                description: data.metaDataProject?.description || "",
                url_image: data.metaDataProject?.url_image || "",
                public_files: data.metaDataProject?.public_files || []
            }
        } as ProjectDataMechanic
    }
}

// get box project by id 

// public_functions 

function differenceMonth(create:string, push:string){
    const d1 = new Date(create);
    const d2 = new Date(push);
  
    const yearsDiff = d1.getFullYear() - d2.getFullYear();
    const monthsDiff = d1.getMonth() - d2.getMonth();
  
    const totalMonths = yearsDiff * 12 + monthsDiff;
  
    if (totalMonths === 0) {
      return -1;
    }
  
    return totalMonths;
}


export default function Project() {
    const [language, setLanguage] = useState<string>('br');
    const [project, setProject] = useState<ProjectData>()
    const params = useParams();
    
    const getLanguage = params?.language as string;
    const getType = params?.type as Type;
    const getId = params?.id as string;

    const getSelectedLanguage = (res:string) => {
        new Analytics().actionLanguageSelect(res)
        setLanguage(res)
    }
    
    const downloadResume = async () => {
        new Analytics().actionResumeDownload()
        window.open(await new Analytics().getRemoteResumeLink(), '_blank');
    }


    async function construcProjectParams(){
        let data;
        if(getType == 'software'){
            const githubProject = await getGitHubProjectById(getId)   
            
            if(!githubProject){
                return 
            }
            
            const languages = await getLanguagesUsed(githubProject.languages_url)
            data = {
                repo_id: getId,
                gitHubData: githubProject,
                languages: languages
            } as ProjectDataSoftware
        }else{
            const firebaseProject = await getFirebaseProjectById(getId)
            data = firebaseProject as ProjectDataMechanic
        }

        setProject({
            software: getType == 'software' ? data as ProjectDataSoftware: null,
            mechanic: getType == 'mechanic' ? data as ProjectDataMechanic : null
        })
    }

    const isMobile = (): boolean => {
        if(typeof window !== 'undefined'){
            const userAgent = navigator.userAgent.toLowerCase();
            if (window.matchMedia("(max-width: 1400px)").matches || /iphone|ipod|android|blackberry|windows phone|mobile|opera mini/.test(userAgent)) {
                new Analytics().actionDeviceTypeAccess('mobile')
                return true;
            } else {
                new Analytics().actionDeviceTypeAccess('desktop')
                return false;
            }
        }else{
            return false;
        }
    }

    useEffect(() => {
        setLanguage(getLanguage)
        construcProjectParams()
    },[])
    return (
        <div className="ProjectPage">
            <HeaderProject isMobile={isMobile()} type={getType} project={project} language={language == "br" ? HeaderProjectBr : HeaderProjectUs}  languageSelect={getSelectedLanguage} languageByIndex={language}/>
            <SectionHeaderProjectImage/>
            {getId && project && (project.mechanic || project.software) ? (
                <AboutProject language={language == 'br' ? AboutProjectBr : AboutProjectUs} project={project} type={getType}/>
            ):""}

            {isMobile() ? (
                <span className='text warningFilesMobile'>{language == 'br' ? LanguageWarningMobile.br.text : LanguageWarningMobile.us.text}</span>
            ):(
                <>
                    <SectionAboutProjectImage/>
                    {getId && project ? (
                        <FileAndProject language={language == 'br' ? LanguagesFileAndProjectBr : LanguagesFileAndProjectUs} project={project} type={getType}/>
                    ): ""}
                </>
            )}


            <Footer downloadResume={downloadResume} isMobile={isMobile()} language={language == 'br' ? LanguagesFooterBr : LanguagesFooterUs}/>
        </div>
    );
}

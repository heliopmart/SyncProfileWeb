'use client'
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {useAuth} from '@/app/hooks/useAuth'
import {backendConfig} from '@/app/config/backendConfig'
import {getCache, setCache} from '@/app/utils/mdCache'
import InterfaceAboutProject from '@/app/i18n/AboutProject';
import ProjectData from "@/app/interfaces/ProjectData"
import "./style.scss";

const FileInFolderIcon = "/images/FileInFolderIcon.svg";

interface AboutProjectProps {
    language: InterfaceAboutProject;
    project: ProjectData; // Caminho do arquivo Markdown
    type: 'software' | 'mechanic'
}

export default function AboutProject({ language, project, type }: AboutProjectProps) {
    const {ValidateRequest, refreshTokenByAuth} = useAuth()
    const [content, setContent] = useState<string>(language.defaultInformationProject);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    async function getMd(){
        const _auth = await ValidateRequest()

        if(!_auth.auth || !_auth.data){
            return
        }

        let markdownContent;
        if(type != 'mechanic'){
            const response_readmeGit = await fetch(backendConfig.BackendUrlRoot+"/github/md", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${_auth.token}`,
                    "nonce": `${_auth.data.nonce()}`
                },
                body: JSON.stringify({
                    device: _auth.data.device,
                    repoName: project.software?.gitHubData.name || ""
                })
            });

            const data_readmeGit = await response_readmeGit.json();

            if(!data_readmeGit.status){
                return 
            }

            refreshTokenByAuth(data_readmeGit.token)
            markdownContent = data_readmeGit.data
        }else{
            if(getCache(project.mechanic?.url_readme || "")){
                markdownContent = getCache(project.mechanic?.url_readme || "")
            }else{

                const response_readmeAzure = await fetch(backendConfig.BackendUrlRoot+"/azure/md", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${_auth.token}`,
                        "nonce": `${_auth.data.nonce()}`
                    },
                    body: JSON.stringify({
                        device: _auth.data.device,
                        repoName: project.mechanic?.url_readme || ""
                    })
                });

                const data_readmeAzure = await response_readmeAzure.json();

                if(!data_readmeAzure.status){
                    return 
                }

                refreshTokenByAuth(data_readmeAzure.token)
                setCache(project.mechanic?.url_readme || "", data_readmeAzure.data)
                markdownContent = data_readmeAzure.data
            }
        }

        return markdownContent;
    }

    async function fetchMarkdownContent() {
        try {
            setIsLoading(true);
            const markdownContent = await getMd();
            
            const _auth = await ValidateRequest()

            if(!_auth.auth || !_auth.data){
                return
            }

            const response = await fetch(backendConfig.BackendUrlRoot+`/render/md`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  "Authorization": `Bearer ${_auth.token}`,
                  "nonce": `${_auth.data.nonce()}`
                },
                body: JSON.stringify({ markdownContent:markdownContent, device: _auth.data.device })
            });
            const data = await response.json();

            if(!data.status){
                return 
            }

            refreshTokenByAuth(data.token)
            if (data.data) {
                setContent(data.data);
            } else {
                setContent(language.defaultInformationProject);
            }
        } catch (error) {
            console.error('Erro ao carregar o Markdown:', error);
            setContent(language.defaultInformationProject);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (project && (project.software?.gitHubData.name || project.mechanic?.id)) {
            fetchMarkdownContent();
        }
    }, []);

    return (
        <main id="aboutProject">
            <div className="content-title">
                <Image src={FileInFolderIcon} alt={language.title} width={100} height={100} />
                <h5 className="text title titleAboutProject">{language.title}</h5>
            </div>
            <section className="section-aboutProject">
                {isLoading ? (
                    <p>Carregando conteúdo...</p>
                ) : (
                    <div
                        className="content_readme"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                )}
            </section>
        </main>
    );
}

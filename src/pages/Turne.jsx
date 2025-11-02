import React, { useState } from 'react'
import { Layout } from '../components/Dashboard/Layout'
import { Sidebar } from '../components/Dashboard/Sidebar'
import { TurneList } from '../components/TurneList'
import { TurneHeader } from '../components/TurneHeader'
import { Modal } from '../components/Modal'
import { Input } from '../components/Input'
import { Calendar } from '../components/Calendar'
import { Textarea } from '../components/Textarea'
import { InputFile } from '../components/InputFile'

export function Turne() {
    const [selectedBand, setSelectedBand] = useState('Boogarins')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [turneData, setTurneData] = useState({
        nome: '',
        inicio: '',
        fim: '',
        descricao: '',
        arquivo: null
    })
    const [selectedStartDate, setSelectedStartDate] = useState(null)
    const [selectedEndDate, setSelectedEndDate] = useState(null)
    const [showStartCalendar, setShowStartCalendar] = useState(false)
    const [showEndCalendar, setShowEndCalendar] = useState(false)

    const bands = ['Boogarins', 'Banda 2', 'Banda 3']

    const turnesData = [
        {
            id: 1,
            name: "Bacuri",
            description: "Please add your content here. Keep it short and simple. And smile :)",
            image: "bacuri.png",
            isHighlighted: true,
            dataInicio: "2024-03-13",
            dataFim: "2024-03-20"
        },
        {
            id: 2,
            name: "Lá Vem a Morte",
            description: "Please add your content here. Keep it short and simple. And smile :)",
            image: "la-vem-a-morte.jpg",
            isHighlighted: false,
            dataInicio: "2024-04-05",
            dataFim: "2024-04-15"
        },
        {
            id: 3,
            name: "Manual",
            description: "Please add your content here. Keep it short and simple. And smile :)",
            image: "manual.jpg",
            isHighlighted: false,
            dataInicio: "2024-05-10",
            dataFim: "2024-05-25"
        }
    ]

    const handleCreateTurne = () => {
        // Reset para modo criar
        setIsEditMode(false)
        setTurneData({
            nome: '',
            inicio: '',
            fim: '',
            descricao: '',
            arquivo: null
        })
        setSelectedStartDate(null)
        setSelectedEndDate(null)
        setIsModalOpen(true)
    }

    const handleEditTurne = (turne) => {
        // Modo editar - preenche com dados do turne
        setIsEditMode(true)
        setTurneData({
            nome: turne.name,
            inicio: turne.dataInicio,
            fim: turne.dataFim,
            descricao: turne.description,
            arquivo: null
        })

        // Converte as datas string para objetos Date
        setSelectedStartDate(turne.dataInicio ? new Date(turne.dataInicio) : null)
        setSelectedEndDate(turne.dataFim ? new Date(turne.dataFim) : null)
        setIsModalOpen(true)
    }
    // ...existing code...

    const handleDeleteTurne = (turne) => {
        console.log('Turnê excluída:', turne)
        // Aqui você faria a exclusão real dos dados
    }

    // ...existing code...



    // ...existing code...

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setIsEditMode(false)
    }

    const handleFinishTurne = () => {
        if (isEditMode) {
            console.log('Turnê editada:', turneData)
        } else {
            console.log('Turnê criada:', turneData)
        }
        setIsModalOpen(false)
        setIsEditMode(false)
    }

    const handleInputChange = (field, value) => {
        setTurneData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const formatDate = (date) => {
        if (!date) return ''
        return date.toLocaleDateString('pt-BR')
    }

    return (
        <Layout>
            <div className="flex h-screen w-full">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <TurneHeader
                        bands={bands}
                        selectedBand={selectedBand}
                        onBandSelect={setSelectedBand}
                        onCreateTurne={handleCreateTurne}
                    />
                    <div className="flex-1 p-6">
                        <TurneList
                            turnes={turnesData}
                            onEditTurne={handleEditTurne}
                            onDeleteTurne={handleDeleteTurne}
                        />
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onFinish={handleFinishTurne}
                title={isEditMode ? "Editar Turnê" : "Criar Turnê"}
                totalSteps={2}
                nextButtonText="Próxima Etapa"
            >
                {(currentStep) => {
                    switch (currentStep) {
                        case 1:
                            return (
                                <div className="flex gap-8">
                                    {/* Inputs à esquerda */}
                                    <div className="flex-1 space-y-6">
                                        <Input
                                            label="Nome da turne:"
                                            placeholder="Chuva dos olhos"
                                            value={turneData.nome}
                                            onChange={(e) => handleInputChange('nome', e.target.value)}
                                            required
                                        />

                                        <Input
                                            label="Início da turne:"
                                            placeholder="13/03/2021"
                                            value={formatDate(selectedStartDate)}
                                            readOnly
                                            required
                                        />

                                        <Input
                                            label="Fim da turne:"
                                            placeholder="15/03/2021"
                                            value={formatDate(selectedEndDate)}
                                            readOnly
                                            required
                                        />
                                    </div>

                                    {/* Calendário à direita */}
                                    <div className="flex-shrink-0">
                                        <Calendar
                                            selectedStartDate={selectedStartDate}
                                            selectedEndDate={selectedEndDate}
                                            onDateSelect={(date) => {
                                                if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
                                                    // Seleciona nova data de início
                                                    setSelectedStartDate(date)
                                                    setSelectedEndDate(null)
                                                    handleInputChange('inicio', formatDate(date))
                                                } else if (date >= selectedStartDate) {
                                                    // Seleciona data de fim (deve ser após início)
                                                    setSelectedEndDate(date)
                                                    handleInputChange('fim', formatDate(date))
                                                } else {
                                                    // Se data for anterior ao início, redefine o início
                                                    setSelectedStartDate(date)
                                                    setSelectedEndDate(null)
                                                    handleInputChange('inicio', formatDate(date))
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                        case 2:
                            return (
                                <div className='flex gap-8'>
                                    <div className='w-[50%]'>
                                        <Textarea
                                            label="Descrição da turnê:"
                                            placeholder="Descreva a turnê, objetivos, público-alvo..."
                                            value={turneData.descricao}
                                            onChange={(e) => handleInputChange('descricao', e.target.value)}
                                            rows={10}
                                            maxLength={500}
                                        />
                                    </div>
                                    <div className='w-[50%]'>
                                        <InputFile
                                            label="Upload de Arquivo:"
                                            onFileSelect={(file) => handleInputChange('arquivo', file)}
                                            required
                                        />
                                    </div>
                                </div>
                            )
                        default:
                            return <div>Etapa não encontrada</div>
                    }
                }}
            </Modal>
        </Layout>
    )
}
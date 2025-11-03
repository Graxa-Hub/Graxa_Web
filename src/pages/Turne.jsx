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
    const [editingTurneId, setEditingTurneId] = useState(null)
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
    const [errors, setErrors] = useState({})

    const bands = ['Boogarins', 'Banda 2', 'Banda 3']

    const [turnesData, setTurnesData] = useState([
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
    ])

    const validateTurne = () => {
        const newErrors = {}

        // Validação do nome
        if (!turneData.nome.trim()) {
            newErrors.nome = 'Nome da turnê é obrigatório'
        } else {
            // Verifica se já existe uma turnê com mesmo nome (exceto se estiver editando a própria)
            const existingTurne = turnesData.find(
                turne => turne.name.toLowerCase() === turneData.nome.toLowerCase() && 
                         turne.id !== editingTurneId
            )
            if (existingTurne) {
                newErrors.nome = 'Já existe uma turnê com este nome'
            }
        }

        // Validação das datas
        if (!selectedStartDate) {
            newErrors.inicio = 'Data de início é obrigatória'
        }
        if (!selectedEndDate) {
            newErrors.fim = 'Data de fim é obrigatória'
        }
        if (selectedStartDate && selectedEndDate && selectedEndDate < selectedStartDate) {
            newErrors.fim = 'Data de fim deve ser posterior à data de início'
        }

        // Validação da descrição
        if (!turneData.descricao.trim()) {
            newErrors.descricao = 'Descrição da turnê é obrigatória'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const getImageName = (fileName) => {
        if (!fileName) return 'default-turne.jpg' // Imagem padrão
        
        // Se for um arquivo, pega o nome
        if (fileName.name) {
            return fileName.name
        }
        
        // Se já for string, retorna
        return fileName
    }

    const handleCreateTurne = () => {
        // Reset para modo criar
        setIsEditMode(false)
        setEditingTurneId(null)
        setTurneData({
            nome: '',
            inicio: '',
            fim: '',
            descricao: '',
            arquivo: null
        })
        setSelectedStartDate(null)
        setSelectedEndDate(null)
        setErrors({})
        setIsModalOpen(true)
    }

    const handleEditTurne = (turne) => {
        // Modo editar - preenche com dados do turne
        setIsEditMode(true)
        setEditingTurneId(turne.id)
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
        setErrors({})
        setIsModalOpen(true)
    }

    const handleDeleteTurne = (turne) => {
        setTurnesData(prev => prev.filter(t => t.id !== turne.id))
        console.log('Turnê excluída:', turne)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setIsEditMode(false)
        setEditingTurneId(null)
        setErrors({})
    }

    const handleFinishTurne = () => {
        if (!validateTurne()) {
            return // Para na primeira etapa se houver erros
        }

        if (isEditMode) {
            // Atualizar turnê existente
            setTurnesData(prev => prev.map(turne => 
                turne.id === editingTurneId 
                    ? {
                        ...turne,
                        name: turneData.nome,
                        description: turneData.descricao,
                        image: getImageName(turneData.arquivo) || turne.image, // Mantém imagem atual se não houver nova
                        dataInicio: selectedStartDate.toISOString().split('T')[0],
                        dataFim: selectedEndDate.toISOString().split('T')[0]
                    }
                    : turne
            ))
            console.log('Turnê editada:', turneData)
        } else {
            // Criar nova turnê
            const newTurne = {
                id: turnesData.length > 0 ? Math.max(...turnesData.map(t => t.id)) + 1 : 1,
                name: turneData.nome,
                description: turneData.descricao,
                image: getImageName(turneData.arquivo), // Usa imagem padrão se não houver arquivo
                isHighlighted: false,
                dataInicio: selectedStartDate.toISOString().split('T')[0],
                dataFim: selectedEndDate.toISOString().split('T')[0]
            }
            setTurnesData(prev => [...prev, newTurne])
            console.log('Turnê criada:', newTurne)
        }
        
        setIsModalOpen(false)
        setIsEditMode(false)
        setEditingTurneId(null)
        setErrors({})
    }

    const handleInputChange = (field, value) => {
        setTurneData(prev => ({
            ...prev,
            [field]: value
        }))
        
        // Limpa erro do campo quando usuário digita
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }))
        }
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
                                        <div>
                                            <Input
                                                label="Nome da turne:"
                                                placeholder="Chuva dos olhos"
                                                value={turneData.nome}
                                                onChange={(e) => handleInputChange('nome', e.target.value)}
                                                required
                                            />
                                            {errors.nome && (
                                                <p className="text-red-500 text-sm mt-1">{errors.nome}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Input
                                                label="Início da turne:"
                                                placeholder="13/03/2021"
                                                value={formatDate(selectedStartDate)}
                                                readOnly
                                                required
                                            />
                                            {errors.inicio && (
                                                <p className="text-red-500 text-sm mt-1">{errors.inicio}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Input
                                                label="Fim da turne:"
                                                placeholder="15/03/2021"
                                                value={formatDate(selectedEndDate)}
                                                readOnly
                                                required
                                            />
                                            {errors.fim && (
                                                <p className="text-red-500 text-sm mt-1">{errors.fim}</p>
                                            )}
                                        </div>
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
                                                    // Limpa erros das datas
                                                    setErrors(prev => ({
                                                        ...prev,
                                                        inicio: undefined,
                                                        fim: undefined
                                                    }))
                                                } else if (date >= selectedStartDate) {
                                                    // Seleciona data de fim (deve ser após início)
                                                    setSelectedEndDate(date)
                                                    handleInputChange('fim', formatDate(date))
                                                    // Limpa erro da data fim
                                                    setErrors(prev => ({
                                                        ...prev,
                                                        fim: undefined
                                                    }))
                                                } else {
                                                    // Se data for anterior ao início, redefine o início
                                                    setSelectedStartDate(date)
                                                    setSelectedEndDate(null)
                                                    handleInputChange('inicio', formatDate(date))
                                                    // Limpa erros das datas
                                                    setErrors(prev => ({
                                                        ...prev,
                                                        inicio: undefined,
                                                        fim: undefined
                                                    }))
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
                                        <div>
                                            <Textarea
                                                label="Descrição da turnê:"
                                                placeholder="Descreva a turnê, objetivos, público-alvo..."
                                                value={turneData.descricao}
                                                onChange={(e) => handleInputChange('descricao', e.target.value)}
                                                rows={10}
                                                maxLength={500}
                                            />
                                            {errors.descricao && (
                                                <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className='w-[50%]'>
                                        <div>
                                            <InputFile
                                                label="Upload de Arquivo (opcional):"
                                                onFileSelect={(file) => handleInputChange('arquivo', file)}
                                            />
                                            <p className="text-sm text-gray-500 mt-1">
                                                Se não enviar uma imagem, será usada uma imagem padrão
                                            </p>
                                        </div>
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
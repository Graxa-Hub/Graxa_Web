package com.graxa.backend.service;

import com.graxa.backend.model.*;
import com.graxa.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PdfService {

    private final ShowRepository showRepository;
    private final AgendaEventoRepository agendaEventoRepository;
    private final AlocacaoRepository alocacaoRepository;
    private final HotelEventoRepository hotelEventoRepository;
    private final TransporteEventoRepository transporteEventoRepository;
    private final PdfGeneratorService pdfGeneratorService; // Serviço que usa Puppeteer ou outra lib

    @Transactional(readOnly = true)
    public byte[] gerarPdfShow(Long showId) {
        log.info("Iniciando geração de PDF para o show ID: {}", showId);

        try {
            // Buscar dados do show
            Show show = showRepository.findById(showId)
                    .orElseThrow(() -> new RuntimeException("Show não encontrado: " + showId));

            // Montar dados para o template
            Map<String, Object> dados = new HashMap<>();

            // Informações básicas
            dados.put("nomeEvento", show.getNomeEvento());
            dados.put("dataGeracao", formatarData(LocalDateTime.now()));
            dados.put("dataEvento", formatarData(show.getDataInicio()));

            // Local
            if (show.getLocal() != null) {
                dados.put("nomeLocal", show.getLocal().getNome());
                dados.put("enderecoCompleto", formatarEndereco(show.getLocal().getEndereco()));
            } else {
                dados.put("nomeLocal", "Local não definido");
                dados.put("enderecoCompleto", "-");
            }

            // Agenda
            List<AgendaEvento> agendas = agendaEventoRepository.findByShowIdOrderByOrdem(showId);
            dados.put("agendas", formatarAgendas(agendas));

            // Calcular progresso
            long totalAgendas = agendas.size();
            long concluidas = agendas.stream()
                    .filter(a -> a.getDataHoraFim() != null && a.getDataHoraFim().isBefore(LocalDateTime.now()))
                    .count();
            int progresso = totalAgendas > 0 ? (int) ((concluidas * 100) / totalAgendas) : 0;
            dados.put("progresso", progresso);

            // Logística - Hotéis
            List<HotelEvento> hoteis = hotelEventoRepository.findByShowId(showId);
            dados.put("totalHoteis", hoteis.size());
            dados.put("hoteis", formatarHoteis(hoteis));

            // Logística - Transportes
            List<TransporteEvento> transportes = transporteEventoRepository.findByShowId(showId);
            dados.put("totalTransportes", transportes.size());
            dados.put("transportes", formatarTransportes(transportes));

            // Logística - Voos (se você tiver essa entidade)
            dados.put("totalVoos", 0); // Implementar se necessário

            // Colaboradores alocados
            List<Alocacao> alocacoes = alocacaoRepository.findByShowId(showId);
            dados.put("colaboradores", formatarColaboradores(alocacoes));

            // Bandas
            if (show.getBandas() != null && !show.getBandas().isEmpty()) {
                dados.put("bandas", true);
                dados.put("listaBandas", formatarBandas(show.getBandas()));
            }

            // Gerar PDF
            byte[] pdfBytes = pdfGeneratorService.gerarPdfDeTemplate("template-pdf-evento.html", dados);

            log.info("PDF gerado com sucesso para o show ID: {}", showId);
            return pdfBytes;

        } catch (Exception e) {
            log.error("Erro ao gerar PDF para o show ID: {}", showId, e);
            throw new RuntimeException("Erro ao gerar PDF: " + e.getMessage(), e);
        }
    }

    private List<Map<String, String>> formatarAgendas(List<AgendaEvento> agendas) {
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        LocalDateTime agora = LocalDateTime.now();

        return agendas.stream().map(agenda -> {
            Map<String, String> map = new HashMap<>();

            String horarioInicio = agenda.getDataHoraInicio().format(timeFormatter);
            String horarioFim = agenda.getDataHoraFim() != null
                    ? agenda.getDataHoraFim().format(timeFormatter)
                    : "";

            map.put("horario", horarioInicio + (horarioFim.isEmpty() ? "" : " - " + horarioFim));
            map.put("titulo", agenda.getTitulo());
            map.put("descricao", agenda.getDescricao() != null ? agenda.getDescricao() : "");

            boolean concluido = agenda.getDataHoraFim() != null && agenda.getDataHoraFim().isBefore(agora);
            map.put("status", concluido ? "Concluído" : "Pendente");
            map.put("statusClass", concluido ? "completed" : "pending");

            return map;
        }).collect(Collectors.toList());
    }

    private List<Map<String, String>> formatarHoteis(List<HotelEvento> hoteis) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        return hoteis.stream().map(hotel -> {
            Map<String, String> map = new HashMap<>();
            map.put("nomeHotel", hotel.getHotel() != null ? hotel.getHotel().getNome() : "Hotel não especificado");
            map.put("checkIn", hotel.getDataHoraCheckIn().format(dateFormatter));
            map.put("checkOut", hotel.getDataHoraCheckOut().format(dateFormatter));
            map.put("quantidadeQuartos", String.valueOf(hotel.getQuantidadeQuartos()));

            // Calcular total de hóspedes (se você tiver essa relação)
            int totalHospedes = hotel.getQuantidadeQuartos() * 2; // Estimativa
            map.put("totalHospedes", String.valueOf(totalHospedes));

            return map;
        }).collect(Collectors.toList());
    }

    private List<Map<String, String>> formatarTransportes(List<TransporteEvento> transportes) {
        return transportes.stream().map(transporte -> {
            Map<String, String> map = new HashMap<>();
            map.put("tipoTransporte", transporte.getTipoTransporte() != null
                    ? transporte.getTipoTransporte()
                    : "Transporte");
            map.put("motorista", transporte.getMotorista() != null
                    ? transporte.getMotorista()
                    : "Não definido");
            map.put("telefone", transporte.getTelefoneMotorista() != null
                    ? transporte.getTelefoneMotorista()
                    : "-");
            map.put("capacidade", transporte.getCapacidade() != null
                    ? String.valueOf(transporte.getCapacidade())
                    : "N/A");
            return map;
        }).collect(Collectors.toList());
    }

    private List<Map<String, String>> formatarColaboradores(List<Alocacao> alocacoes) {
        return alocacoes.stream().map(alocacao -> {
            Map<String, String> map = new HashMap<>();

            Colaborador colab = alocacao.getColaborador();
            map.put("nome", colab.getNome());
            map.put("funcao", colab.getFuncao() != null ? colab.getFuncao() : "Colaborador");

            // Iniciais para o avatar
            String[] nomes = colab.getNome().split(" ");
            String iniciais = nomes.length >= 2
                    ? (nomes[0].charAt(0) + "" + nomes[1].charAt(0)).toUpperCase()
                    : colab.getNome().substring(0, Math.min(2, colab.getNome().length())).toUpperCase();
            map.put("iniciais", iniciais);

            return map;
        }).collect(Collectors.toList());
    }

    private List<Map<String, String>> formatarBandas(List<Banda> bandas) {
        return bandas.stream().map(banda -> {
            Map<String, String> map = new HashMap<>();
            map.put("nomeBanda", banda.getNome());
            map.put("genero", banda.getGenero() != null ? banda.getGenero() : "Não especificado");
            return map;
        }).collect(Collectors.toList());
    }

    private String formatarData(LocalDateTime data) {
        if (data == null)
            return "-";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        return data.format(formatter);
    }

    private String formatarEndereco(Endereco endereco) {
        if (endereco == null)
            return "-";

        StringBuilder sb = new StringBuilder();
        if (endereco.getLogradouro() != null)
            sb.append(endereco.getLogradouro());
        if (endereco.getNumero() != null)
            sb.append(", ").append(endereco.getNumero());
        if (endereco.getCidade() != null)
            sb.append(" - ").append(endereco.getCidade());
        if (endereco.getEstado() != null)
            sb.append("/").append(endereco.getEstado());
        if (endereco.getCep() != null)
            sb.append(" - CEP: ").append(endereco.getCep());

        return sb.toString();
    }
}

package com.workflow.system.service;

import com.workflow.system.entity.Request;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ExportService {

    public String exportRequestsToCSV(List<Request> requests) {
        StringBuilder csv = new StringBuilder();

        // Header
        csv.append("ID,Title,Requester,Type,Status,Priority,Submitted Date,Completed Date\n");

        // Data rows
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        for (Request request : requests) {
            csv.append(request.getId()).append(",");
            csv.append(escapeCSV(request.getTitle())).append(",");
            csv.append(escapeCSV(request.getRequester().getFullName())).append(",");
            csv.append(escapeCSV(request.getRequestType().getName())).append(",");
            csv.append(request.getStatus()).append(",");
            csv.append(request.getPriority()).append(",");
            csv.append(request.getSubmittedAt() != null ? request.getSubmittedAt().format(formatter) : "").append(",");
            csv.append(request.getCompletedAt() != null ? request.getCompletedAt().format(formatter) : "");
            csv.append("\n");
        }

        return csv.toString();
    }

    private String escapeCSV(String value) {
        if (value == null)
            return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}

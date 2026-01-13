package com.workflow.system.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class BulkApprovalDTO {
    private List<Long> requestIds;
    private String comments;
}

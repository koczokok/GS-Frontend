package org.example.Enums;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public enum Metrics {
    RMSE("RMSE"),
    ROC_AUC("ROC_AUC");

    private final String metric;

    Metrics(String metric) {
        this.metric = metric;
    }

    public static Metrics getEnumFromMetric(String metric) {
        return Metrics.valueOf(metric.toUpperCase());
    }

    public double calculate(byte[] predictionsFile, byte[] truthFile) {
        List<Double> predictions = loadValuesFromCsv(predictionsFile);
        List<Double> truth = loadValuesFromCsv(truthFile);

        return switch (this) {
            case RMSE -> calculateRmse(predictions, truth);
            case ROC_AUC -> calculateRocAuc(predictions, truth);
            default -> throw new IllegalArgumentException("Unsupported metric: " + metric);
        };
    }

    private List<Double> loadValuesFromCsv(byte[] fileBytes) {
        List<Double> values = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(new ByteArrayInputStream(fileBytes)))) {

            String line;
            boolean first = true;

            while ((line = reader.readLine()) != null) {

                if (first) {
                    first = false;
                    continue;
                }

                String[] parts = line.split(",");

                if (parts.length < 2) {
                    throw new IllegalArgumentException("Invalid CSV format — expected at least 2 columns");
                }

                values.add(Double.parseDouble(parts[1]));
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to read CSV file", e);
        }

        return values;
    }

    private double calculateRmse(List<Double> pred, List<Double> truth) {
        if (pred.size() != truth.size()) {
            throw new IllegalArgumentException("Prediction and truth sizes do not match");
        }

        double sum = 0;
        for (int i = 0; i < pred.size(); i++) {
            double diff = pred.get(i) - truth.get(i);
            sum += diff * diff;
        }
        return Math.sqrt(sum / pred.size());
    }

    private double calculateRocAuc(List<Double> pred, List<Double> truth) {
        if (pred.size() != truth.size()) {
            throw new IllegalArgumentException("Prediction and truth sizes do not match");
        }

        List<Pair> pairs = new ArrayList<>();
        for (int i = 0; i < pred.size(); i++) {
            pairs.add(new Pair(pred.get(i), truth.get(i)));
        }

        pairs.sort((a, b) -> Double.compare(b.pred, a.pred));

        double tp = 0, fp = 0;
        double prevTp = 0, prevFp = 0;
        double auc = 0;

        long positives = truth.stream().filter(v -> v == 1.0).count();
        long negatives = truth.size() - positives;

        if (positives == 0 || negatives == 0) {
            return 0.5;
        }

        for (Pair p : pairs) {
            if (p.truth == 1.0) tp++;
            else fp++;

            if (fp != prevFp) {
                auc += (fp - prevFp) * ((tp + prevTp) / 2.0);
                prevTp = tp;
                prevFp = fp;
            }
        }

        return auc / (positives * negatives);
    }

    private static class Pair {
        double pred;
        double truth;

        Pair(double pred, double truth) {
            this.pred = pred;
            this.truth = truth;
        }
    }
}

import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import ChordSheetView from "../components/ChordSheetView";
import type { ChordSheet } from "../models/ChordSheet";
import { ProcessorFactory } from "../processors/ProcessorFactory";
import { ScraperFactory } from "../scrapers/ScraperFactory";

export default function Index() {
  const [url, setUrl] = useState(
    "https://wrytin.com/manojyadav/maine-royaan-kwxvpihx"
  );

  const [chordSheet, setChordSheet] =
    useState<ChordSheet | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchHtml = async () => {
    if (!url.trim()) {
      setError("Please enter a song URL");
      return;
    }

    setLoading(true);
    setError("");
    setChordSheet(null);

    try {
      const response = await fetch(url.trim());

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();

      // Select scraper based on hostname
      const scraper = ScraperFactory.getScraper(url);

      // Extract website-specific content
      const content = scraper.scrape(html);

      // Select processor based on hostname
      const processor = ProcessorFactory.getProcessor(url);

      // Convert to common ChordSheet structure
      const result = processor.process(content);

      console.log(
        "ChordSheet:",
        JSON.stringify(result, null, 2)
      );

      setChordSheet(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to fetch the song"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === "ios" ? "padding" : undefined
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoIcon}>♫</Text>
          </View>

          <View>
            <Text style={styles.title}>Chordly</Text>
            <Text style={styles.subtitle}>
              Guitar chords, simplified.
            </Text>
          </View>
        </View>

        {/* URL Input */}
        <View style={styles.searchCard}>
          <Text style={styles.inputLabel}>SONG URL</Text>

          <TextInput
            style={styles.input}
            value={url}
            onChangeText={setUrl}
            placeholder="Paste a song URL..."
            placeholderTextColor="#666"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="go"
            onSubmitEditing={fetchHtml}
          />

          <Pressable
            style={({ pressed }) => [
              styles.fetchButton,
              pressed && styles.fetchButtonPressed,
              loading && styles.fetchButtonDisabled,
            ]}
            onPress={fetchHtml}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#111" />
            ) : (
              <>
                <Text style={styles.fetchButtonText}>
                  Get Chords
                </Text>
                <Text style={styles.arrow}>→</Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Error */}
        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorIcon}>!</Text>

            <View style={styles.errorContent}>
              <Text style={styles.errorTitle}>
                Couldn't load song
              </Text>

              <Text style={styles.errorText}>
                {error}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Chord Sheet */}
        {chordSheet ? (
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <View>
                <Text style={styles.resultTitle}>
                  Chord Sheet
                </Text>

                <Text style={styles.resultSubtitle}>
                  Ready to play
                </Text>
              </View>

              {chordSheet.capo !== undefined && (
                <View style={styles.capoBadge}>
                  <Text style={styles.capoLabel}>CAPO</Text>
                  <Text style={styles.capoValue}>
                    {chordSheet.capo}
                  </Text>
                </View>
              )}
            </View>

            <ChordSheetView chordSheet={chordSheet} />
          </View>
        ) : !loading && !error ? (
          /* Empty state */
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎸</Text>

            <Text style={styles.emptyTitle}>
              Find your chords
            </Text>

            <Text style={styles.emptyText}>
              Paste a supported song URL above and we'll
              turn it into an easy-to-read chord sheet.
            </Text>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0D0D0F",
  },

  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  logo: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F4A340",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  logoIcon: {
    color: "#111",
    fontSize: 28,
    fontWeight: "bold",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  subtitle: {
    color: "#777",
    fontSize: 13,
    marginTop: 2,
  },

  searchCard: {
    backgroundColor: "#171719",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#252527",
  },

  inputLabel: {
    color: "#777",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#0E0E10",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#29292C",
    color: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
  },

  fetchButton: {
    height: 50,
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: "#F4A340",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  fetchButtonPressed: {
    opacity: 0.75,
  },

  fetchButtonDisabled: {
    opacity: 0.6,
  },

  fetchButtonText: {
    color: "#111",
    fontSize: 15,
    fontWeight: "800",
  },

  arrow: {
    color: "#111",
    fontSize: 22,
    fontWeight: "600",
    marginLeft: 8,
  },

  errorCard: {
    marginTop: 14,
    backgroundColor: "#261719",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#4A2528",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  errorIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#D9534F",
    color: "#FFF",
    textAlign: "center",
    lineHeight: 28,
    fontWeight: "bold",
    marginRight: 12,
  },

  errorContent: {
    flex: 1,
  },

  errorTitle: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },

  errorText: {
    color: "#B98C8C",
    fontSize: 12,
    marginTop: 3,
  },

  resultContainer: {
    flex: 1,
    marginTop: 24,
  },

  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  resultTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
  },

  resultSubtitle: {
    color: "#666",
    fontSize: 12,
    marginTop: 3,
  },

  capoBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#24201A",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#4B3820",
    paddingVertical: 7,
    paddingHorizontal: 10,
  },

  capoLabel: {
    color: "#A9824B",
    fontSize: 9,
    fontWeight: "800",
    marginRight: 6,
  },

  capoValue: {
    color: "#F4A340",
    fontSize: 16,
    fontWeight: "800",
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 35,
    paddingBottom: 80,
  },

  emptyIcon: {
    fontSize: 54,
    marginBottom: 18,
  },

  emptyTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "800",
  },

  emptyText: {
    color: "#666",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 8,
  },
});

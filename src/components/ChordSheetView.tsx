import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  ChordLine,
  ChordSheet,
} from "../models/ChordSheet";

type Props = {
  chordSheet: ChordSheet;
};

export default function ChordSheetView({
  chordSheet,
}: Props) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {chordSheet.sections.map((section, sectionIndex) => (
        <View
          key={sectionIndex}
          style={styles.section}
        >
          {section.title ? (
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLine} />

              <Text style={styles.sectionTitle}>
                {section.title}
              </Text>

              <View style={styles.sectionLine} />
            </View>
          ) : null}

          <View style={styles.linesContainer}>
            {section.lines.map((line, lineIndex) => (
              <ChordLineView
                key={lineIndex}
                line={line}
              />
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function ChordLineView({
  line,
}: {
  line: ChordLine;
}) {
  return (
    <View style={styles.line}>
      {line.parts.map((part, index) => {
        if (part.type === "chord") {
          return (
            <Text
              key={index}
              style={styles.chord}
            >
              {part.value}
            </Text>
          );
        }

        return (
          <Text
            key={index}
            style={styles.lyrics}
          >
            {part.value}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111113",
    borderRadius: 18,
  },

  content: {
    paddingHorizontal: 18,
    paddingVertical: 20,
    paddingBottom: 60,
  },

  section: {
    marginBottom: 28,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#29292C",
  },

  sectionTitle: {
    color: "#777",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginHorizontal: 12,
    textTransform: "uppercase",
  },

  linesContainer: {
    paddingHorizontal: 2,
  },

  line: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
    minHeight: 29,
  },

  chord: {
    color: "#F4A340",
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 29,
  },

  lyrics: {
    color: "#D4D4D6",
    fontSize: 17,
    lineHeight: 29,
  },
});

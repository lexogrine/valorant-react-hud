export const panelDefinition = [
  {
    "label": "Display settings",
    "name": "display_settings",
    "inputs": [
      {
        "type": "select",
        "name": "view_type",
        "label": "Select View Type",
        "values": [
          {
            "label": "Scoreboard",
            "name": "scoreboard"
          }
        ]
      }
    ]
  }
] as const;
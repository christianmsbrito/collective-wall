class CreateColorPalettes < ActiveRecord::Migration[7.0]
  def change
    create_table :color_palettes do |t|
      t.text :colors

      t.timestamps
    end
  end
end

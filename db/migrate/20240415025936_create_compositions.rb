class CreateCompositions < ActiveRecord::Migration[7.0]
  def change
    create_table :compositions do |t|
      t.text :qualities

      t.timestamps
    end
  end
end
